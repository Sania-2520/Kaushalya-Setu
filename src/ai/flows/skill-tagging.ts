// SkillTagging flow for automatically identifying and tagging skills from project descriptions and uploads.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillTaggingInputSchema = z.object({
  description: z.string().describe('The description of the project.'),
});
export type SkillTaggingInput = z.infer<typeof SkillTaggingInputSchema>;

const SkillTaggingOutputSchema = z.object({
  skills: z.array(z.string()).describe('An array of skills identified in the description.'),
});
export type SkillTaggingOutput = z.infer<typeof SkillTaggingOutputSchema>;

export async function identifySkills(input: SkillTaggingInput): Promise<SkillTaggingOutput> {
  return skillTaggingFlow(input);
}

const skillTaggingPrompt = ai.definePrompt({
  name: 'skillTaggingPrompt',
  input: {schema: SkillTaggingInputSchema},
  output: {schema: SkillTaggingOutputSchema},
  prompt: `You are an AI assistant specialized in identifying skills from project descriptions.
  Given the following project description, extract the relevant skills and return them as an array of strings.
  Description: {{{description}}}
  Skills:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const skillTaggingFlow = ai.defineFlow(
  {
    name: 'skillTaggingFlow',
    inputSchema: SkillTaggingInputSchema,
    outputSchema: SkillTaggingOutputSchema,
  },
  async input => {
    const {output} = await skillTaggingPrompt(input);
    return output!;
  }
);
