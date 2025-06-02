
'use server';
/**
 * @fileOverview A Genkit flow to act as a proxy for the JSearch API.
 *
 * - searchJobs - Fetches job listings from JSearch API.
 * - JSearchInput - Input schema for the searchJobs flow.
 * - JSearchOutput - Output schema for the searchJobs flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const JSearchJobSchema = z.object({
  job_id: z.string().nullable().optional(),
  employer_name: z.string().nullable().optional(),
  employer_logo: z.string().url().nullable().optional(),
  job_title: z.string().nullable().optional(),
  job_description: z.string().nullable().optional(),
  job_employment_type: z.string().nullable().optional(),
  job_apply_link: z.string().url().nullable().optional(),
  job_city: z.string().nullable().optional(),
  job_state: z.string().nullable().optional(),
  job_country: z.string().nullable().optional(),
  job_posted_at_datetime_utc: z.string().datetime().nullable().optional(),
  job_publisher: z.string().nullable().optional(),
  // Add other fields you might need from JSearch
});
export type JSearchJob = z.infer<typeof JSearchJobSchema>;

const JSearchInputSchema = z.object({
  query: z.string().describe('Search query (e.g., "Software Engineer in Bengaluru")'),
  page: z.number().min(1).default(1).describe('Page number for pagination'),
  employmentTypes: z.string().optional().describe('Comma-separated list of employment types (e.g., FULLTIME,INTERN)'),
});
export type JSearchInput = z.infer<typeof JSearchInputSchema>;

const JSearchOutputSchema = z.object({
  jobs: z.array(JSearchJobSchema).describe('List of jobs found'),
  total_jobs: z.number().nullable().optional().describe('Total number of jobs found for the query (approximate)'),
  total_pages: z.number().nullable().optional().describe('Estimated total pages based on default items per page'),
});
export type JSearchOutput = z.infer<typeof JSearchOutputSchema>;

export async function searchJobs(input: JSearchInput): Promise<JSearchOutput> {
  return jsearchApiFlow(input);
}

const jsearchApiFlow = ai.defineFlow(
  {
    name: 'jsearchApiFlow',
    inputSchema: JSearchInputSchema,
    outputSchema: JSearchOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.JSEARCH_API_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (!apiKey || !apiHost) {
      throw new Error('JSearch API key or host not configured in environment variables.');
    }

    const { query, page, employmentTypes } = input;
    const searchParams = new URLSearchParams({
      query: query,
      page: page.toString(),
      num_pages: '1', 
    });

    if (employmentTypes) {
      searchParams.append('employment_types', employmentTypes.toUpperCase());
    }
    
    const url = `https://${apiHost}/search?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`JSearch API error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Failed to fetch jobs from JSearch API: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      
      // JSearch often returns about 20 items per request with num_pages=1
      const itemsPerPage = data.data?.length || 20; 
      // The 'total' or 'estimated_total_results' field in JSearch can be unreliable.
      // A simple pagination strategy: if 20 items are returned, assume there might be more.
      const totalJobs = data.estimated_total_results || (data.data?.length || 0) ; 
      const totalPages = data.data?.length > 0 ? page + (data.data.length === itemsPerPage ? 1: 0) : page; 

      return {
        jobs: data.data || [], 
        total_jobs: totalJobs,
        total_pages: totalPages,
      };
    } catch (error) {
      console.error('Error in jsearchApiFlow:', error);
      // Re-throw for the frontend to handle display of the error
      throw new Error(`JSearch API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
