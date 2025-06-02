
'use server';
/**
 * @fileOverview A Genkit flow to analyze a resume PDF and provide feedback including a score.
 *
 * - getResumeFeedback - A function that handles the resume analysis process.
 * - ResumeFeedbackInput - The input type for the getResumeFeedback function.
 * - ResumeFeedbackOutput - The return type for the getResumeFeedback function, including feedback text and a score.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeFeedbackInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The PDF resume as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ResumeFeedbackInput = z.infer<typeof ResumeFeedbackInputSchema>;

const ResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, actionable feedback on the resume, formatted for readability (e.g., using markdown-like structure).'),
  score: z.number().min(0).max(100).describe('An overall score for the resume out of 100, based on the analysis.'),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

const resumeFeedbackPrompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  model: 'googleai/gemini-2.0-flash', 
  input: {schema: ResumeFeedbackInputSchema},
  output: {schema: ResumeFeedbackOutputSchema},
  prompt: `You are an expert career advisor and resume reviewer for polytechnic students and recent graduates.
You will be provided with a student's resume as a PDF.
Your task is to analyze the resume thoroughly and provide personalized, actionable feedback to help the student improve it.

The feedback should be comprehensive and cover the following aspects:
1.  **Overall Impression:** Start with a brief summary of the resume's strengths and weaknesses.
2.  **Structure and Formatting:** Comment on the layout, readability, use of white space, font choices, and consistency. Are sections clear? Is it easy to scan? (e.g., "Consider using bullet points more effectively in your experience section.")
3.  **Contact Information:** Is it complete and professional? (e.g., "Ensure your LinkedIn profile URL is included and clickable if possible.")
4.  **Summary/Objective (if present):** Is it concise, tailored, and impactful? (e.g., "Your objective is a bit generic. Try to tailor it to the types of roles you're applying for.")
5.  **Education Section:** Is it clearly presented? Include degree, institution, graduation date (or expected), and relevant coursework or academic achievements if applicable. (e.g., "List your CGPA if it's strong.")
6.  **Experience Section (Projects, Internships, Work):**
    *   Are descriptions action-oriented (using action verbs like 'Developed', 'Implemented', 'Managed')?
    *   Do they quantify achievements where possible (e.g., "Increased efficiency by 15%", "Led a team of 3")?
    *   Are roles and responsibilities clear?
    *   Is it tailored to common job roles for polytechnic students (e.g., entry-level tech, internships)?
7.  **Skills Section:** Are relevant technical skills (e.g., programming languages, tools) and soft skills listed? Is there a good balance? Are they too generic or specific enough? Are there any obvious missing skills based on the experience/projects? (e.g., "Categorize your skills into Technical and Soft Skills for better clarity.")
8.  **Keywords and ATS Friendliness:** Does the resume use keywords relevant to the student's target roles? Is it likely to pass through Applicant Tracking Systems (ATS)? (e.g., "Incorporate keywords from job descriptions like 'React', 'Node.js', 'Agile methodology'.")
9.  **Grammar and Spelling:** Point out any obvious errors or areas for improvement in language. (e.g., "Proofread carefully for typos, especially in project descriptions.")
10. **Completeness:** Are there any critical missing sections (e.g., Projects if they are a student, a clear Skills section)?
11. **Specific Actionable Suggestions:** Provide 3-5 concrete, numbered suggestions for improvement. For example:
    1.  Quantify your achievements in the 'E-commerce Website' project description.
    2.  Add a dedicated 'Projects' section if you have more academic or personal projects.
    3.  Tailor your resume slightly for different job applications by highlighting the most relevant skills and experiences.

Present the feedback in a clear, well-structured manner. Use markdown-like formatting for headings (e.g., **Section Title:**), bullet points (using '*' or '-'), and bold text for emphasis.
Be constructive and encouraging throughout your feedback.

Finally, based on all the above criteria, provide an overall score for the resume out of 100. This score should be a single integer value representing the resume's current effectiveness for job/internship applications by polytechnic students.

Resume to analyze:
{{media url=resumeDataUri}}

Feedback:
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
  }
});

const resumeFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeFeedbackFlow',
    inputSchema: ResumeFeedbackInputSchema,
    outputSchema: ResumeFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await resumeFeedbackPrompt(input);
    if (!output || typeof output.feedback !== 'string' || typeof output.score !== 'number') {
        throw new Error("No valid feedback or score was generated by the AI.");
    }
    return output;
  }
);
