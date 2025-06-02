
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
      num_pages: '1', // JSearch's num_pages seems to act more like items per page, or is complex. Let's fetch ~20 items per page.
                     // The API is a bit inconsistent with total results vs. pagination.
                     // We'll request for 20 results and estimate total_pages. RapidAPI usually limits results per page.
    });

    if (employmentTypes) {
      searchParams.append('employment_types', employmentTypes.toUpperCase());
    }
    
    // Rapid API's JSearch has a specific parameter for job_requirements like 'no_experience' etc.
    // And 'date_posted' (all, today, 3days, week, month)
    // For this implementation, we are keeping it simple.

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
        throw new Error(`Failed to fetch jobs from JSearch API: ${response.statusText}`);
      }

      const data = await response.json();
      
      // JSearch API's `total` field might not always be present or accurate.
      // We'll estimate total_pages based on typical items per page if needed.
      // JSearch often returns about 20 items if `num_pages` isn't highly effective as items per page.
      const itemsPerPage = data.data?.length || 20; 
      // The 'total' field in JSearch response often gives a large number that doesn't match pagination.
      // It's safer to not rely on it for total_pages or provide a rough estimate.
      // For simplicity, we'll assume only one page of results based on `num_pages: '1'`.
      // If you need more sophisticated pagination, you'll need to explore JSearch's behavior more.
      const totalJobs = data.parameters?.num_pages * (data.data?.length || 0) ; // This is a guess, JSearch is tricky.
      const totalPages = data.data?.length > 0 ? page + (data.data.length === 20 ? 1: 0) : page; // Basic: if we get 20, assume there might be more.

      return {
        jobs: data.data || [], // Ensure 'data' key exists and has jobs
        total_jobs: totalJobs || (data.data?.length || 0),
        total_pages: totalPages,
      };
    } catch (error) {
      console.error('Error in jsearchApiFlow:', error);
      // Return empty results or re-throw for caller to handle
      return { jobs: [], total_jobs: 0, total_pages: 1 };
    }
  }
);
