"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  Loader2,
  Sparkles,
  AlertCircle,
  Download,
  ScanSearch,
  FileSignature,
  ThumbsUp,
  Info,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  getResumeFeedback,
  ResumeFeedbackInput,
  ResumeFeedbackOutput,
} from "@/ai/flows/resume-feedback-flow";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
type SectionAnalysis = {
  name: string;
  score: number;
  feedback: string;
  isMissing?: boolean;
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export default function ResumeAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [targetRoleOrDomain, setTargetRoleOrDomain] = useState<string>("");
  const [feedbackResult, setFeedbackResult] =
    useState<ResumeFeedbackOutput | null>(null);
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
      toast({
        title: "No Resume Uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setFeedbackResult(null);

    try {
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(resumeFile as File);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const input: ResumeFeedbackInput = {
        resumeDataUri: base64data,
        targetRoleOrDomain: targetRoleOrDomain || undefined,
      };

      const result = await getResumeFeedback(input);

      setFeedbackResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Your resume feedback is ready.",
      });
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: `Could not analyze resume. ${
          error instanceof Error
            ? error.message
            : "An unknown error occurred or the AI returned an unexpected format. Check console for details."
        }`,
        variant: "destructive",
      });
      setFeedbackResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (
    score: number,
    maxScore: number = 100
  ): "text-green-600" | "text-yellow-600" | "text-red-600" => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColorClass = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "[&>div]:bg-green-500";
    if (percentage >= 60) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  };

  return (
    <div className="space-y-8">
      {/* Intro Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ScanSearch className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">
                📄 Resume Analyzer
              </CardTitle>
              <CardDescription className="mt-1 text-sm md:text-base">
                Improve your resume with AI! Upload your resume and let our
                intelligent analyzer review it for structure, skills, keywords,
                and completeness. You'll receive a score out of 100 along with
                personalized feedback to improve your resume for internships
                and job applications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-semibold mb-1">Our tool checks for:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>
              Common sections (Education, Experience, Projects, Skills,
              Certifications, etc.)
            </li>
            <li>
              Keyword relevance (technical skills, action verbs, alignment with
              target role)
            </li>
            <li>Resume structure, formatting, and clarity</li>
            <li>ATS (Applicant Tracking System) friendliness</li>
          </ul>
          <p className="text-sm font-semibold text-primary">
            🔍 Just upload your resume and get instant insights — faster than a
            career counselor!
          </p>
        </CardContent>
      </Card>

      {/* Upload Card */}
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Upload Your Resume</CardTitle>
          <CardDescription>
            Provide your resume in PDF format (max {MAX_FILE_SIZE_MB}MB).
            Optionally, specify a target role for more tailored feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resumeUploadAnalyzer">
              Resume File (PDF only, Max {MAX_FILE_SIZE_MB}MB)
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start font-normal"
                onClick={() =>
                  document
                    .getElementById("resume-input-analyzer-page")
                    ?.click()
                }
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {selectedFileName || "Choose your resume file..."}
              </Button>
              <Input
                id="resume-input-analyzer-page"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetRoleOrDomain">
              Target Job Role or Domain (Optional)
            </Label>
            <Input
              id="targetRoleOrDomain"
              value={targetRoleOrDomain}
              onChange={(e) => setTargetRoleOrDomain(e.target.value)}
              placeholder="e.g., Software Engineer, Data Analyst"
            />
          </div>
          <Button
            onClick={handleAnalyzeResume}
            disabled={isLoading || !resumeFile}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Analyzing..." : "Analyze My Resume"}
          </Button>
        </CardContent>
      </Card>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Our AI is reviewing your resume... This might take a moment.
          </p>
        </div>
      )}

      {/* Feedback Section */}
      {feedbackResult && !isLoading && (
        <Card className="shadow-xl mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" /> Your Resume Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Overall Score:</h3>
              <div className="flex items-center space-x-3">
                <Progress
                  value={feedbackResult.overallScore}
                  className={`w-full h-4 ${getProgressColorClass(
                    feedbackResult.overallScore
                  )}`}
                />
                <Badge
                  className={`text-lg px-3 py-1 ${getScoreColor(
                    feedbackResult.overallScore
                  ).replace("text-", "bg-")} text-white`}
                >
                  {feedbackResult.overallScore}/100
                </Badge>
              </div>
            </div>

            {/* Accordion with feedback */}
            <Accordion
              type="multiple"
              defaultValue={["summary", "keywords", "sections"]}
              className="w-full"
            >
              {/* Summary */}
              <AccordionItem value="summary">
                <AccordionTrigger className="text-lg font-semibold">
                  Summary & Key Suggestions
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <Textarea
                    value={feedbackResult.summaryFeedback}
                    readOnly
                    className="min-h-[150px] bg-muted/30 text-sm leading-relaxed border-border"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Keyword Analysis */}
              {feedbackResult.keywordAnalysis && (
                <AccordionItem value="keywords">
                  <AccordionTrigger className="text-lg font-semibold">
                    Keyword Analysis
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-3">
                    {feedbackResult.keywordAnalysis.relevantKeywordsFound &&
                      feedbackResult.keywordAnalysis.relevantKeywordsFound
                        .length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                            Relevant Keywords Found:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {feedbackResult.keywordAnalysis.relevantKeywordsFound.map(
                              (kw) => (
                                <Badge
                                  key={kw}
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 border-green-300"
                                >
                                  {kw}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {feedbackResult.keywordAnalysis.missingKeywordsForTargetRole &&
                      feedbackResult.keywordAnalysis.missingKeywordsForTargetRole
                        .length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                            Keywords to Consider for &apos;
                            {targetRoleOrDomain || "Target Role"}&apos;:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {feedbackResult.keywordAnalysis.missingKeywordsForTargetRole.map(
                              (kw) => (
                                <Badge
                                  key={kw}
                                  variant="outline"
                                  className="border-blue-300 text-blue-800"
                                >
                                  {kw}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {feedbackResult.keywordAnalysis.powerVerbSuggestions &&
                      feedbackResult.keywordAnalysis.powerVerbSuggestions.length >
                        0 && (
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                            Power Verb & Phrasing Suggestions:
                          </p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                            {feedbackResult.keywordAnalysis.powerVerbSuggestions.map(
                              (sugg, i) => (
                                <li key={i}>{sugg}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {!feedbackResult.keywordAnalysis.relevantKeywordsFound?.length &&
                    !feedbackResult.keywordAnalysis.missingKeywordsForTargetRole
                      ?.length &&
                    !feedbackResult.keywordAnalysis.powerVerbSuggestions?.length ? (
                      <p className="text-sm text-muted-foreground italic">
                        No specific keyword or phrasing analysis provided in this
                        report.
                      </p>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section Analysis */}
              {feedbackResult.sectionsAnalysis &&
                feedbackResult.sectionsAnalysis.length > 0 && (
                  <AccordionItem value="sections">
                    <AccordionTrigger className="text-lg font-semibold">
                      Detailed Section Analysis
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Section</TableHead>
                            <TableHead className="text-center w-[80px]">Score</TableHead>
                            <TableHead>Feedback & Suggestions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feedbackResult.sectionsAnalysis.map(
                            (section: SectionAnalysis) => (
                              <TableRow
                                key={section.name}
                                className={section.isMissing ? "bg-yellow-500/10" : ""}
                              >
                                <TableCell className="font-medium">
                                  {section.name}
                                  {section.isMissing && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                      Missing
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell
                                  className={`text-center font-semibold ${getScoreColor(
                                    section.score,
                                    10
                                  )}`}
                                >
                                  {section.isMissing ? "N/A" : `${section.score}/10`}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {section.feedback}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                )}

              {/* Formatting & Clarity */}
              {feedbackResult.formattingAndClarity && (
                <AccordionItem value="formatting">
                  <AccordionTrigger className="text-lg font-semibold">
                    Formatting & Clarity (Score: {feedbackResult.formattingAndClarity.score}/10)
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <Progress
                      value={feedbackResult.formattingAndClarity.score * 10}
                      className={`h-2 mb-3 ${getProgressColorClass(
                        feedbackResult.formattingAndClarity.score,
                        10
                      )}`}
                    />
                    {feedbackResult.formattingAndClarity.suggestions &&
                    feedbackResult.formattingAndClarity.suggestions.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                        {feedbackResult.formattingAndClarity.suggestions.map((sugg, i) => (
                          <li key={i}>{sugg}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No specific formatting or clarity suggestions provided.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* ATS Friendliness */}
              {feedbackResult.atsFriendliness && (
                <AccordionItem value="ats">
                  <AccordionTrigger className="text-lg font-semibold">
                    ATS Friendliness (Score: {feedbackResult.atsFriendliness.score}/10)
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <Progress
                      value={feedbackResult.atsFriendliness.score * 10}
                      className={`h-2 mb-3 ${getProgressColorClass(
                        feedbackResult.atsFriendliness.score,
                        10
                      )}`}
                    />
                    {feedbackResult.atsFriendliness.suggestions &&
                    feedbackResult.atsFriendliness.suggestions.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                        {feedbackResult.atsFriendliness.suggestions.map((sugg, i) => (
                          <li key={i}>{sugg}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No specific ATS friendliness suggestions provided.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-3 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" /> Download Report (PDF)
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setResumeFile(null);
                  setSelectedFileName(null);
                  setFeedbackResult(null);
                  const fileInput = document.getElementById(
                    "resume-input-analyzer-page"
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
              >
                <UploadCloud className="mr-2 h-4 w-4" /> Analyze Another Resume
              </Button>
              <Button variant="outline" asChild>
                <Link href="/resume-builder">
                  <FileSignature className="mr-2 h-4 w-4" /> Edit in Resume Builder
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground italic flex items-center mt-2 sm:mt-0">
              <AlertCircle className="h-3 w-3 mr-1" /> AI feedback is for guidance. Use your judgment.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
