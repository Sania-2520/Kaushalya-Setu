// use server'

/**
 * @fileOverview Implements the smart recommendation engine flow to match students with relevant internship and job opportunities.
 *
 * - recommendOpportunities - A function that takes student skills and portfolio content to provide career recommendations.
 * - RecommendOpportunitiesInput - The input type for the recommendOpportunities function.
 * - RecommendOpportunitiesOutput - The return type for the recommendOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOpportunitiesInputSchema = z.object({
  studentSkills: z.array(z.string()).describe('List of skills possessed by the student.'),
  portfolioContent: z.string().describe('Description of the student\'s portfolio content.'),
  desiredJobType: z.string().describe('The type of job the student is looking for, such as internship, full-time, or part-time.'),
});
export type RecommendOpportunitiesInput = z.infer<typeof RecommendOpportunitiesInputSchema>;

const RecommendedOpportunitySchema = z.object({
  jobTitle: z.string().describe('The title of the job or internship.'),
  companyName: z.string().describe('The name of the company offering the opportunity.'),
  description: z.string().describe('A brief description of the job or internship.'),
  relevanceScore: z.number().describe('A score indicating how relevant the opportunity is to the student (0-1).'),
});

const RecommendOpportunitiesOutputSchema = z.object({
  recommendations: z.array(RecommendedOpportunitySchema).describe('A list of recommended job or internship opportunities.'),
});
export type RecommendOpportunitiesOutput = z.infer<typeof RecommendOpportunitiesOutputSchema>;

export async function recommendOpportunities(input: RecommendOpportunitiesInput): Promise<RecommendOpportunitiesOutput> {
  return recommendOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendOpportunitiesPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: RecommendOpportunitiesInputSchema},
  output: {schema: RecommendOpportunitiesOutputSchema},
  prompt: `You are an AI career advisor specializing in matching students with internships and jobs.

  Based on the student's skills, portfolio content, and desired job type, recommend the best opportunities for them.

  Student Skills: {{studentSkills}}
  Portfolio Content: {{portfolioContent}}
  Desired Job Type: {{desiredJobType}}

  Return a list of job/internship recommendations tailored to the student's profile. Each recommendation should include the job title, company name, description, and a relevance score (0-1).
  `,
});

const recommendOpportunitiesFlow = ai.defineFlow(
  {
    name: 'recommendOpportunitiesFlow',
    inputSchema: RecommendOpportunitiesInputSchema,
    outputSchema: RecommendOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
