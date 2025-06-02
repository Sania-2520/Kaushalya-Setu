
'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered feedback on resumes.
 *
 * - getResumeFeedback - Analyzes a resume and provides feedback and a score.
 * - ResumeFeedbackInput - Input schema type for the resume feedback flow.
 * - ResumeFeedbackOutput - Output schema type for the resume feedback flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const ResumeFeedbackInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported mimetypes: application/pdf."
    ),
  targetRoleOrDomain: z.string().optional().describe('Optional: The target job role or domain (e.g., "Software Engineer", "Data Science").'),
});
export type ResumeFeedbackInput = z.infer<typeof ResumeFeedbackInputSchema>;

// Output Schema
const SectionAnalysisSchema = z.object({
  name: z.string().describe('Name of the resume section (e.g., "Projects", "Experience", "Education", "Skills", "Certifications").'),
  score: z.number().min(0).max(10).describe('Score for this section out of 10.'),
  feedback: z.string().describe('Specific feedback or suggestions for this section.'),
  isMissing: z.boolean().optional().describe('True if this common section appears to be missing.'),
});

const KeywordAnalysisSchema = z.object({
    relevantKeywordsFound: z.array(z.string()).optional().describe('Technical keywords or skills found in the resume relevant to common job descriptions or the target role/domain if provided.'),
    missingKeywordsForTargetRole: z.array(z.string()).optional().describe('Keywords that seem to be missing, especially if a target role/domain was specified.'),
    powerVerbSuggestions: z.array(z.string()).optional().describe('Suggestions for stronger action verbs or rephrasing bullet points for impact.'),
});

const FormattingClaritySchema = z.object({
    score: z.number().min(0).max(10).describe('Score for overall formatting, readability, and clarity (0-10).'),
    suggestions: z.array(z.string()).optional().describe('Suggestions related to formatting, grammar, conciseness, and readability.'),
});

const AtsFriendlinessSchema = z.object({
    score: z.number().min(0).max(10).describe('Score for ATS (Applicant Tracking System) compatibility (0-10).'),
    suggestions: z.array(z.string()).optional().describe('Suggestions to improve ATS compatibility.'),
});


const ResumeFeedbackOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('An overall score for the resume out of 100, based on the analysis. Factors include completeness, keyword relevance, structure, and clarity.'),
  summaryFeedback: z.string().describe('A general summary of the resume analysis and key overall suggestions. This should be a concise overview.'),
  keywordAnalysis: KeywordAnalysisSchema.optional().describe('Analysis of keywords relevant to tech roles, including missing keywords for a target role and power verb suggestions.'),
  sectionsAnalysis: z.array(SectionAnalysisSchema).optional().describe('Detailed analysis of key resume sections, including scores, specific feedback, and noting if common sections are missing.'),
  formattingAndClarity: FormattingClaritySchema.optional().describe('Analysis of resume formatting and clarity, including a score and suggestions.'),
  atsFriendliness: AtsFriendlinessSchema.optional().describe('Assessment of ATS friendliness, including a score and suggestions.'),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackOutputSchema>;


// Main exported function
export async function getResumeFeedback(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

// Genkit Prompt
const resumeFeedbackPrompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: ResumeFeedbackInputSchema },
  output: { schema: ResumeFeedbackOutputSchema },
  prompt: `You are an expert AI career advisor specializing in reviewing resumes for individuals, particularly students seeking internships/entry-level jobs in technology fields.
If a targetRoleOrDomain is provided: "{{targetRoleOrDomain}}", tailor your keyword analysis and feedback specifically towards this role/domain. Otherwise, provide general feedback suitable for tech roles.

Analyze the provided resume carefully: {{media url=resumeDataUri}}

Provide comprehensive and actionable feedback based on the following structure:

1.  **Overall Score (0-100):** A holistic score reflecting the resume's readiness.
2.  **Summary Feedback:** A concise overview of the resume's strengths and critical areas for improvement.
3.  **Keyword Analysis:**
    *   'relevantKeywordsFound': List technical skills/keywords present that are valuable.
    *   'missingKeywordsForTargetRole': If a target role/domain was given, list crucial keywords for that role that are absent.
    *   'powerVerbSuggestions': Suggest stronger action verbs for bullet points or identify areas for more impactful language.
4.  **Sections Analysis (Array of Objects):**
    For each common resume section (Personal Details, Education, Experience, Projects, Skills, Certifications, Achievements, Languages):
    *   'name': The name of the section.
    *   'score' (0-10): How well this section is presented.
    *   'feedback': Specific, actionable suggestions for this section.
    *   'isMissing' (boolean, optional): Mark as true if a standard section is completely missing and should be added.
    Ensure that all common sections are covered in your analysis, even if to say they are well-done or are missing.
5.  **Formatting & Clarity:**
    *   'score' (0-10): For overall layout, readability, conciseness, grammar.
    *   'suggestions': List specific issues (e.g., "Inconsistent date formats", "Typos found", "Overuse of passive voice", "Consider using a more modern template").
6.  **ATS Friendliness:**
    *   'score' (0-10): How well the resume is optimized for Applicant Tracking Systems.
    *   'suggestions': Tips like "Use standard section headings", "Avoid tables or columns if they hinder parsing", "Ensure skills are clearly listed".

Your response MUST strictly follow the ResumeFeedbackOutputSchema.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
       {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

// Genkit Flow
const resumeFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeFeedbackFlow',
    inputSchema: ResumeFeedbackInputSchema,
    outputSchema: ResumeFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await resumeFeedbackPrompt(input);
    if (!output) {
      throw new Error('The AI failed to generate feedback for the resume.');
    }
    return output;
  }
);
