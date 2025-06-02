
"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Loader2, FileText, Sparkles, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getResumeFeedback, ResumeFeedbackInput, ResumeFeedbackOutput } from '@/ai/flows/resume-feedback-flow';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF and DOCX

export default function ResumeReviewerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "File too large",
          description: `Please upload a resume under ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        setSelectedFileName(null);
        setResumeFile(null);
        event.target.value = ""; // Clear the input
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
         toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        });
        setSelectedFileName(null);
        setResumeFile(null);
        event.target.value = ""; // Clear the input
        return;
      }
      setResumeFile(file);
      setSelectedFileName(file.name);
      setFeedback(null); // Clear previous feedback
      setScore(null); // Clear previous score
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({ title: "No Resume Uploaded", description: "Please upload your resume first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setFeedback(null);
    setScore(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const input: ResumeFeedbackInput = { resumeDataUri: base64data };
        const result: ResumeFeedbackOutput = await getResumeFeedback(input);
        
        if (result && result.feedback) {
          setFeedback(result.feedback);
          setScore(result.score);
          toast({ title: "Analysis Complete!", description: "Your resume feedback is ready." });
        } else {
          throw new Error("AI did not return valid feedback.");
        }
        setIsLoading(false);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({ title: "File Reading Error", description: "Could not read the resume file.", variant: "destructive" });
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({ title: "Analysis Failed", description: `Could not analyze resume. ${error instanceof Error ? error.message : 'Please try again.'}`, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center">
        <Sparkles className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight font-headline text-primary">
          AI Resume Analyzer
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80 font-body">
          Upload your resume (PDF or DOCX, max {MAX_FILE_SIZE_MB}MB) and let our intelligent analyzer review it for structure, skills, keywords, and completeness.
          You'll receive a score out of 100 along with personalized feedback to improve your resume for internships and job applications.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Upload Your Resume</CardTitle>
          <CardDescription>
            Our tool checks for missing sections, highlights relevant tech keywords, and suggests powerful improvements. 
            Get instant insights — faster than a career counselor!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resumeUpload">Resume File (PDF or DOCX, Max {MAX_FILE_SIZE_MB}MB)</Label>
            <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" className="w-full justify-start font-normal" onClick={() => document.getElementById('resume-input-analyzer')?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {selectedFileName || "Choose your resume file..."}
                </Button>
                <Input id="resume-input-analyzer" type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
          <Button onClick={handleAnalyzeResume} disabled={isLoading || !resumeFile} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            {isLoading ? "Analyzing..." : "Analyze My Resume"}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Our AI is reviewing your resume... This might take a moment.</p>
        </div>
      )}

      {score !== null && feedback && !isLoading && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Resume Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overall Score:</h3>
              <div className="flex items-center space-x-3">
                <Progress value={score} className="w-full h-4" />
                <span className="text-2xl font-bold text-primary">{score}/100</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Detailed Feedback:</h3>
              <Textarea value={feedback} readOnly className="min-h-[300px] bg-muted/30 text-sm font-mono leading-relaxed" />
            </div>
             <AlertCircle className="h-4 w-4 text-muted-foreground inline-block mr-1"/>
             <span className="text-xs text-muted-foreground italic">
                This AI-generated feedback is for guidance only. Always use your best judgment and consider seeking advice from career counselors.
             </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
