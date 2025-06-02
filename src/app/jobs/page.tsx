
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Building, MapPin, Search, Filter, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { INDIAN_CITIES, JOB_TYPES, ALL_FILTER_VALUE } from '@/lib/constants';
import { searchJobs, JSearchInput, JSearchOutput, JSearchJob } from '@/ai/flows/jsearch-flow';

// Mapping for display names to JSearch API values for Job Types
const JOB_TYPE_API_VALUES: { [key: string]: string } = {
  "Internship": "INTERN",
  "Full-time": "FULLTIME",
  "Part-time": "PARTTIME",
  "Contract": "CONTRACTOR", // JSearch uses CONTRACTOR for Contract
  "Freelance": "FREELANCE", // Assuming JSearch supports this, otherwise map to CONTRACTOR or similar
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JSearchJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("Software Developer"); // Default search
  const [selectedLocation, setSelectedLocation] = useState(INDIAN_CITIES[0]); // Default to Bengaluru
  const [selectedJobType, setSelectedJobType] = useState(ALL_FILTER_VALUE);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { toast } = useToast();

  const fetchJobs = useCallback(async (isNewSearch: boolean = false) => {
    setIsLoadingJobs(true);
    setError(null);
    if (isNewSearch) {
      setCurrentPage(1); // Reset to page 1 for new searches
      setJobs([]); // Clear old jobs for a new search
    }

    let query = searchTerm.trim();
    if (selectedLocation !== ALL_FILTER_VALUE && selectedLocation) {
      query = `${query} in ${selectedLocation}`;
    }
    
    const apiJobType = selectedJobType !== ALL_FILTER_VALUE && JOB_TYPE_API_VALUES[selectedJobType] 
      ? JOB_TYPE_API_VALUES[selectedJobType] 
      : undefined;

    const input: JSearchInput = {
      query: query || "jobs", // Default to "jobs" if query is empty
      page: isNewSearch ? 1 : currentPage,
      employmentTypes: apiJobType,
    };

    try {
      const result: JSearchOutput = await searchJobs(input);
      if (isNewSearch) {
        setJobs(result.jobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...result.jobs]);
      }
      setTotalPages(result.total_pages || 1);
      if (result.jobs.length === 0 && (isNewSearch || currentPage === 1)) {
        toast({ title: "No Jobs Found", description: "Try adjusting your filters or search terms." });
      }
    } catch (err) {
      console.error("Error fetching jobs from JSearch flow:", err);
      const errorMessage = err instanceof Error ? err.message : "Could not fetch jobs.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      setJobs([]); // Clear jobs on error
    } finally {
      setIsLoadingJobs(false);
    }
  }, [searchTerm, selectedLocation, selectedJobType, currentPage, toast]);

  useEffect(() => {
    fetchJobs(true); // Initial fetch, isNewSearch = true
  }, [searchTerm, selectedLocation, selectedJobType]); // Re-fetch when these filters change (will reset page to 1)

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      // Trigger fetch for the next page
       const nextPage = currentPage + 1;
        let query = searchTerm.trim();
        if (selectedLocation !== ALL_FILTER_VALUE && selectedLocation) {
          query = `${query} in ${selectedLocation}`;
        }
        const apiJobType = selectedJobType !== ALL_FILTER_VALUE && JOB_TYPE_API_VALUES[selectedJobType] 
          ? JOB_TYPE_API_VALUES[selectedJobType] 
          : undefined;

        const input: JSearchInput = {
          query: query || "jobs",
          page: nextPage,
          employmentTypes: apiJobType,
        };
        setIsLoadingJobs(true);
        searchJobs(input).then(result => {
            setJobs(prevJobs => [...prevJobs, ...result.jobs]);
            setTotalPages(result.total_pages || 1);
            setCurrentPage(nextPage);
        }).catch(err => {
            console.error("Error fetching more jobs:", err);
            toast({ title: "Error", description: "Could not load more jobs.", variant: "destructive" });
        }).finally(() => setIsLoadingJobs(false));
    }
  };
  
  const handleFilterChangeAndSearch = () => {
    // This function can be called by a search button if you add one,
    // or simply rely on the useEffect for direct changes.
    // For this setup, useEffect handles it.
    fetchJobs(true);
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Find Your Next Opportunity</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/>Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="search">Search Keywords (e.g., Job Title, Skill)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="search" 
                placeholder="Software Engineer, React..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChangeAndSearch()}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="locationFilter">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="locationFilter"><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Locations (Global)</SelectItem>
                {INDIAN_CITIES.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="jobTypeFilter">Job Type</Label>
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger id="jobTypeFilter"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Types</SelectItem>
                {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
             <Button onClick={handleFilterChangeAndSearch} disabled={isLoadingJobs}>
                {isLoadingJobs && searchTerm ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4" />}
                Search Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">Job Listings ({jobs.length > 0 ? `Showing ${jobs.length} jobs` : ''})</h2>
        {isLoadingJobs && jobs.length === 0 ? ( // Show skeletons only on initial load or full new search
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <JobCardSkeleton key={i} />)}
            </div>
        ) : error ? (
             <Card className="text-center py-12 bg-destructive/10 border-destructive">
                <CardContent className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <p className="text-destructive font-semibold text-lg">Failed to load jobs</p>
                <p className="text-muted-foreground font-body">{error}</p>
                <Button onClick={() => fetchJobs(true)} variant="outline">Try Again</Button>
                </CardContent>
            </Card>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground font-body">No jobs match your current filters. Try adjusting your search or check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => job.job_id ? <JobCard key={`${job.job_id}-${index}`} job={job} /> : null)}
          </div>
        )}
        
        {!isLoadingJobs && jobs.length > 0 && currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore} variant="outline" disabled={isLoadingJobs}>
              {isLoadingJobs && currentPage > 1 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Load More Jobs
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

interface JobCardProps {
  job: JSearchJob;
}

function JobCard({ job }: JobCardProps) {
  const { job_id, job_title, employer_name, employer_logo, job_city, job_state, job_employment_type, job_description, job_apply_link, job_publisher, job_posted_at_datetime_utc } = job;

  const displayLocation = [job_city, job_state].filter(Boolean).join(", ");

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        {employer_logo ? (
          <Image src={employer_logo} alt={`${employer_name || 'Company'} logo`} width={48} height={48} className="rounded-md border object-contain bg-white" data-ai-hint="company logo"/>
        ) : (
          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
            <Building className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold font-headline leading-tight">{job_title || "N/A"}</CardTitle>
          <p className="text-sm text-muted-foreground">{employer_name || job_publisher || "N/A"}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {displayLocation && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" /> {displayLocation}
          </div>
        )}
        {job_employment_type && (
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <BriefcaseBusiness className="h-3 w-3 mr-1" /> {job_employment_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        )}
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3 font-body">{job_description || "No description available."}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
         <p className="text-xs text-muted-foreground">
          {job_posted_at_datetime_utc ? `Posted: ${new Date(job_posted_at_datetime_utc).toLocaleDateString()}` : (job_publisher ? `Via: ${job_publisher}`: '')}
        </p>
        {job_apply_link ? (
            <Button size="sm" variant="default" asChild>
            <Link href={job_apply_link} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-2 h-3 w-3"/>
            </Link>
            </Button>
        ): (
            <Badge variant="outline">No Apply Link</Badge>
        )}
      </CardFooter>
    </Card>
  );
}

function JobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <div className="h-12 w-12 bg-muted rounded-md"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3"></div>
        <div className="h-3 bg-muted rounded w-1/4"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-8 w-24 bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
}
