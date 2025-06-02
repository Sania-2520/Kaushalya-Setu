
"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, UploadCloud, Sparkles, AlertCircle } from "lucide-react";
import { getResumeFeedback, ResumeFeedbackInput, ResumeFeedbackOutput } from '@/ai/flows/resume-feedback-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function ResumeReviewerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<ResumeFeedbackOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        if (file.size <= MAX_FILE_SIZE_BYTES) {
          setResumeFile(file);
          setResumeFileName(file.name);
          setFeedbackResult(null); // Clear previous feedback
        } else {
          toast({ title: "File Too Large", description: `Resume PDF must be ${MAX_FILE_SIZE_MB}MB or less.`, variant: "destructive" });
          setResumeFile(null);
          setResumeFileName(null);
        }
      } else {
        toast({ title: "Invalid File Type", description: "Please upload a PDF file for your resume.", variant: "destructive" });
        setResumeFile(null);
        setResumeFileName(null);
      }
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({ title: "No Resume Selected", description: "Please upload your resume PDF first.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setFeedbackResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onload = async () => {
        const resumeDataUri = reader.result as string;
        if (!resumeDataUri) {
          toast({ title: "Error Reading File", description: "Could not read the resume file.", variant: "destructive" });
          setIsAnalyzing(false);
          return;
        }
        const input: ResumeFeedbackInput = { resumeDataUri };
        const result: ResumeFeedbackOutput = await getResumeFeedback(input);
        setFeedbackResult(result);
        toast({ title: "Resume Analysis Complete!", description: "Check your feedback and score below." });
      };
      reader.onerror = () => {
        toast({ title: "Error Reading File", description: "Could not read the resume file.", variant: "destructive" });
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({ title: "Resume Analysis Error", description: `Could not analyze resume. ${error instanceof Error ? error.message : 'Please try again.'}`, variant: "destructive" });
      setFeedbackResult({ feedback: "Failed to get feedback. Please try again.", score: 0 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex justify-center items-center mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">AI Resume Analyzer</CardTitle>
          <CardDescription className="max-w-2xl mx-auto text-lg text-foreground/80 font-body">
            Upload your resume and let our intelligent analyzer review it for structure, skills, keywords, and completeness. 
            You'll receive a score out of 100 along with personalized feedback to improve your resume for internships and job applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground font-body">
              Our tool checks for missing sections like projects or skills, highlights relevant tech keywords, and suggests powerful improvements.
            </p>
            <p className="text-sm text-primary font-semibold mt-2">
              🔍 Just upload your resume and get instant insights — faster than a career counselor!
            </p>
          </div>
          
          <div className="max-w-xl mx-auto p-6 border rounded-lg bg-card">
             <div className="space-y-2 mb-4">
                <Label htmlFor="resumeUpload" className="font-semibold text-base">Upload Your Resume (PDF, Max {MAX_FILE_SIZE_MB}MB)</Label>
                <div className="flex items-center gap-3">
                    <Input 
                    id="resumeUpload" 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <Button onClick={handleAnalyzeResume} disabled={!resumeFile || isAnalyzing} className="whitespace-nowrap">
                        {isAnalyzing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <FileText className="mr-2 h-4 w-4" />
                        )}
                        {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                </div>
                 {resumeFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {resumeFileName}</p>}
            </div>

            {isAnalyzing && (
                <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyzing your resume, please wait...</p>
                </div>
            )}

            {feedbackResult && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold font-headline mb-2">Your Resume Score:</h3>
                  <div className="flex items-center justify-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-5xl font-bold text-primary">{feedbackResult.score} <span className="text-2xl text-muted-foreground">/ 100</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-headline mb-2">Personalized Feedback:</h3>
                  <Textarea
                    readOnly
                    value={feedbackResult.feedback}
                    className="min-h-[300px] font-body bg-background border-border text-sm p-4 rounded-md"
                    rows={20}
                  />
                </div>
              </div>
            )}

            {!isAnalyzing && !feedbackResult && (
                 <div className="text-center py-10 text-muted-foreground">
                    <Image src="https://placehold.co/300x200.png?text=Upload+Resume+to+Start" alt="Upload resume illustration" width={300} height={200} className="mx-auto mb-4 rounded-lg" data-ai-hint="resume upload document" />
                    <p>Upload your resume above to get started.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
