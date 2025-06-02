
'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered feedback on resumes.
 *
 * - getResumeFeedback - Analyzes a resume and provides feedback and a score.
 * - ResumeFeedbackInput - Input schema for the resume feedback flow.
 * - ResumeFeedbackOutput - Output schema for the resume feedback flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ResumeFeedbackInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported mimetypes: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document."
    ),
});
export type ResumeFeedbackInput = z.infer<typeof ResumeFeedbackInputSchema>;

export const ResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed feedback on the resume, including suggestions for improvement. Should be formatted clearly, perhaps using markdown-like lists or paragraphs.'),
  score: z.number().min(0).max(100).describe('An overall score for the resume out of 100, based on the analysis. Factors include completeness, keyword relevance, structure, and clarity.'),
  missingSections: z.array(z.string()).optional().describe('List of common resume sections detected as missing (e.g., "Projects", "Skills", "Experience" if applicable).'),
  keywordAnalysis: z.object({
    relevantKeywordsFound: z.array(z.string()).optional().describe('Tech keywords found that are relevant to common job descriptions.'),
    suggestedKeywordsToAdd: z.array(z.string()).optional().describe('Keywords that could be added to improve ATS compatibility or relevance for target roles like polytechnic student internships/jobs.'),
  }).optional().describe('Analysis of keywords relevant to tech roles.'),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

const resumeFeedbackPrompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  model: 'googleai/gemini-2.0-flash', // Assuming this model can handle multimodal input or text extraction happens implicitly for supported document types.
  input: { schema: ResumeFeedbackInputSchema },
  output: { schema: ResumeFeedbackOutputSchema },
  prompt: `You are an expert AI career advisor specializing in reviewing resumes for polytechnic students seeking internships and entry-level jobs in technology fields (e.g., Web Development, Data Science, Cybersecurity, IT).

Analyze the provided resume carefully: {{media url=resumeDataUri}}

Provide comprehensive and actionable feedback. Your feedback should cover:
1.  **Overall Score (0-100):** Give a holistic score reflecting the resume's readiness for job applications. Consider completeness, clarity, impact, and relevance to tech roles for polytechnic students.
2.  **Structure & Completeness:**
    *   Are all essential sections present (Contact Info, Education, Skills, Projects, Experience if any)? List any clearly missing standard sections in 'missingSections'.
    *   Is the information well-organized and easy to read?
3.  **Content & Impact:**
    *   Are achievements quantified where possible?
    *   Is the language clear, concise, and professional? Are there strong action verbs?
    *   For projects/experience, is the student's role and contribution clear?
4.  **Keyword Relevance & ATS Friendliness:**
    *   Identify relevant technical skills and keywords present in the resume. Populate 'keywordAnalysis.relevantKeywordsFound'.
    *   Suggest specific technical keywords or skills that could be added to make the resume more attractive for tech roles commonly sought by polytechnic students and improve Applicant Tracking System (ATS) compatibility. Populate 'keywordAnalysis.suggestedKeywordsToAdd'.
5.  **Specific Suggestions for Improvement:** Provide concrete examples or actionable advice on how to improve each section. Tailor suggestions to a polytechnic student audience.

Format the 'feedback' field clearly. Use markdown for lists or distinct paragraphs for better readability.
Ensure the 'score' is a number between 0 and 100.
The 'missingSections' array should only contain names of sections that are truly absent and standard for a student resume.
The 'keywordAnalysis' object should contain arrays of strings for keywords.
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
