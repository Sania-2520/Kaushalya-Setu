
"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Loader2, FileText, Sparkles, AlertCircle, Download, ScanSearch, FileSignature } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getResumeFeedback, ResumeFeedbackInput, ResumeFeedbackOutput } from '@/ai/flows/resume-feedback-flow';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export default function ResumeAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<ResumeFeedbackOutput | null>(null);
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
        event.target.value = ""; 
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
         toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        setSelectedFileName(null);
        setResumeFile(null);
        event.target.value = "";
        return;
      }
      setResumeFile(file);
      setSelectedFileName(file.name);
      setFeedbackResult(null); 
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({ title: "No Resume Uploaded", description: "Please upload your resume first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setFeedbackResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const input: ResumeFeedbackInput = { resumeDataUri: base64data };
        const result: ResumeFeedbackOutput = await getResumeFeedback(input);
        
        if (result && result.feedback) {
          setFeedbackResult(result);
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

  const getScoreColor = (score: number): "bg-green-500" | "bg-yellow-500" | "bg-red-500" | "bg-primary" => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                 <ScanSearch className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="text-2xl md:text-3xl font-bold font-headline">📄 Resume Analyzer</CardTitle>
                    <CardDescription className="mt-1 text-sm md:text-base">
                        Improve your resume with AI! Upload your resume and let our intelligent analyzer review it for structure, skills, keywords, and completeness. 
                        You'll receive a score out of 100 along with personalized feedback to improve your resume for internships and job applications.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="font-semibold mb-1">Our tool checks for:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
                <li>Missing sections (like projects, skills, achievements)</li>
                <li>Keyword density (relevant tech skills, action verbs)</li>
                <li>Resume structure and formatting</li>
                <li>Role alignment and clarity</li>
            </ul>
            <p className="text-sm font-semibold text-primary">
                🔍 Just upload your resume and get instant insights — faster than a career counselor!
            </p>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Upload Your Resume</CardTitle>
          <CardDescription>
            Provide your resume in PDF format (max {MAX_FILE_SIZE_MB}MB).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resumeUploadAnalyzer">Resume File (PDF only, Max {MAX_FILE_SIZE_MB}MB)</Label>
            <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" className="w-full justify-start font-normal" onClick={() => document.getElementById('resume-input-analyzer-page')?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {selectedFileName || "Choose your resume file..."}
                </Button>
                <Input id="resume-input-analyzer-page" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
          <Button onClick={handleAnalyzeResume} disabled={isLoading || !resumeFile} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
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

      {feedbackResult && !isLoading && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Resume Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overall Score:</h3>
              <div className="flex items-center space-x-3">
                <Progress value={feedbackResult.score} className={`w-full h-4 [&>div]:${getScoreColor(feedbackResult.score)}`} />
                <Badge className={`text-lg px-3 py-1 ${getScoreColor(feedbackResult.score)} text-white`}>{feedbackResult.score}/100</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">AI Feedback:</h3>
              <Textarea value={feedbackResult.feedback} readOnly className="min-h-[250px] bg-muted/30 text-sm font-mono leading-relaxed border-border" />
            </div>

            {feedbackResult.missingSections && feedbackResult.missingSections.length > 0 && (
                 <div>
                    <h4 className="text-lg font-semibold mb-1">Missing Sections:</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                        {feedbackResult.missingSections.map(section => <li key={section}>{section}</li>)}
                    </ul>
                </div>
            )}

            {feedbackResult.keywordAnalysis && (
                 <div>
                    <h4 className="text-lg font-semibold mb-1">Keyword Analysis:</h4>
                    {feedbackResult.keywordAnalysis.relevantKeywordsFound && feedbackResult.keywordAnalysis.relevantKeywordsFound.length > 0 && (
                        <div className="mb-2">
                            <p className="text-sm font-medium text-green-700">Relevant Keywords Found:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {feedbackResult.keywordAnalysis.relevantKeywordsFound.map(kw => <Badge key={kw} variant="secondary" className="bg-green-100 text-green-800">{kw}</Badge>)}
                            </div>
                        </div>
                    )}
                    {feedbackResult.keywordAnalysis.suggestedKeywordsToAdd && feedbackResult.keywordAnalysis.suggestedKeywordsToAdd.length > 0 && (
                         <div>
                            <p className="text-sm font-medium text-blue-700">Suggested Keywords to Add:</p>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {feedbackResult.keywordAnalysis.suggestedKeywordsToAdd.map(kw => <Badge key={kw} variant="outline" className="border-blue-300 text-blue-800">{kw}</Badge>)}
                            </div>
                        </div>
                    )}
                    {(!feedbackResult.keywordAnalysis.relevantKeywordsFound || feedbackResult.keywordAnalysis.relevantKeywordsFound.length === 0) && 
                     (!feedbackResult.keywordAnalysis.suggestedKeywordsToAdd || feedbackResult.keywordAnalysis.suggestedKeywordsToAdd.length === 0) &&
                     <p className="text-sm text-muted-foreground italic">No specific keywords identified for highlighting or suggestion in this analysis.</p>
                    }
                </div>
            )}
             <p className="text-sm text-muted-foreground mt-4">
                **Formatting Issues & Suggestions for Improvement** are typically included within the main AI Feedback text above. The AI also considers **Skill Relevance** during its analysis.
             </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-3 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" /> Download Report (PDF)
              </Button>
               <Button variant="secondary" onClick={() => {
                 setResumeFile(null);
                 setSelectedFileName(null);
                 setFeedbackResult(null);
                 const fileInput = document.getElementById('resume-input-analyzer-page') as HTMLInputElement;
                 if(fileInput) fileInput.value = "";
               }}>
                <UploadCloud className="mr-2 h-4 w-4" /> Re-upload & Analyze New Resume
              </Button>
               <Button variant="outline" asChild>
                <Link href="/resume-builder">
                    <FileSignature className="mr-2 h-4 w-4" /> Edit in Resume Builder
                </Link>
              </Button>
            </div>
             <p className="text-xs text-muted-foreground italic flex items-center mt-2 sm:mt-0">
                <AlertCircle className="h-3 w-3 mr-1"/> AI feedback is for guidance.
             </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
