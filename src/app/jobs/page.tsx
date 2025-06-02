
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Building, MapPin, Filter, Loader2, ExternalLink, PlusCircle, AlertCircle, Check, ChevronsUpDown, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query as firestoreQuery, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { INDIAN_CITIES, JOB_TITLES, JOB_TYPES, IT_KEYWORDS, ALL_FILTER_VALUE } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string; // Full-time, Part-time, Internship
  description: string;
  skills: string[];
  postedDate: Date;
  salary?: string;
}

const postJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  companyLogo: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  salary: z.string().optional(),
});

type PostJobFormData = z.infer<typeof postJobSchema>;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedTitle, setSelectedTitle] = useState(ALL_FILTER_VALUE);
  const [selectedLocation, setSelectedLocation] = useState(ALL_FILTER_VALUE);
  const [selectedJobType, setSelectedJobType] = useState(ALL_FILTER_VALUE);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [openSkillsPopover, setOpenSkillsPopover] = useState(false);

  const { toast } = useToast();

  const { register, handleSubmit, control, reset: resetPostJobForm, watch: watchPostJobForm, setValue: setPostJobFormValue, formState: { errors: postJobErrors } } = useForm<PostJobFormData>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      skills: [],
      companyLogo: '',
    }
  });
  const newJobSkills = watchPostJobForm('skills', []);


  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    setError(null);
    try {
      const jobsCollection = collection(db, 'jobs');
      const q = firestoreQuery(jobsCollection, orderBy('postedDate', 'desc'));
      const jobSnapshot = await getDocs(q);
      const jobList = jobSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          postedDate: (data.postedDate as Timestamp)?.toDate ? (data.postedDate as Timestamp).toDate() : new Date(),
        } as Job;
      });
      setJobs(jobList);
    } catch (err) {
      console.error("Error fetching jobs from Firestore:", err);
      const errorMessage = err instanceof Error ? err.message : "Could not fetch jobs.";
      setError(errorMessage);
      toast({ title: "Error Fetching Jobs", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingJobs(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const uniqueTitles = useMemo(() => {
    if (jobs.length === 0 && JOB_TITLES.length > 0) return JOB_TITLES;
    const titles = new Set(jobs.map(job => job.title));
    return Array.from(titles).sort();
  }, [jobs]);

  const uniqueLocations = useMemo(() => {
    if (jobs.length === 0 && INDIAN_CITIES.length > 0) return INDIAN_CITIES;
    const locations = new Set(jobs.map(job => job.location));
    return Array.from(locations).sort();
  }, [jobs]);

  const uniqueJobTypes = useMemo(() => {
    if (jobs.length === 0 && JOB_TYPES.length > 0) return JOB_TYPES;
    const types = new Set(jobs.map(job => job.type));
    return Array.from(types).sort();
  }, [jobs]);
  
  const allSkillsForFilter = useMemo(() => {
     if (jobs.length === 0 && IT_KEYWORDS.length > 0) return IT_KEYWORDS.sort();
     const skillsSet = new Set<string>();
     jobs.forEach(job => job.skills.forEach(skill => skillsSet.add(skill)));
     return Array.from(skillsSet).sort();
  }, [jobs]);


  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesTitle = selectedTitle === ALL_FILTER_VALUE || job.title === selectedTitle;
      const matchesLocation = selectedLocation === ALL_FILTER_VALUE || job.location === selectedLocation;
      const matchesJobType = selectedJobType === ALL_FILTER_VALUE || job.type === selectedJobType;
      
      const matchesKeywords = selectedKeywords.length === 0 || selectedKeywords.every(keyword => job.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase())));

      return matchesTitle && matchesLocation && matchesJobType && matchesKeywords;
    });
  }, [jobs, selectedTitle, selectedLocation, selectedJobType, selectedKeywords]);

  const handlePostJobSubmit = async (data: PostJobFormData) => {
    setIsSubmittingJob(true);
    try {
      const docRef = await addDoc(collection(db, "jobs"), {
        ...data,
        postedDate: serverTimestamp(),
      });
      toast({ title: "Job Posted!", description: `"${data.title}" has been successfully posted.` });
      setIsPostJobDialogOpen(false);
      resetPostJobForm();
      // Optimistically add to local state or refetch
      const newJobWithId: Job = {
        ...data,
        id: docRef.id,
        postedDate: new Date(), // Approximate, Firestore will set actual server timestamp
      };
      setJobs(prevJobs => [newJobWithId, ...prevJobs]);

    } catch (e) {
      console.error("Error adding document: ", e);
      toast({ title: "Error Posting Job", description: "Could not post the job. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmittingJob(false);
    }
  };
  
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const toggleNewJobSkill = (skill: string) => {
    const currentSkills = newJobSkills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    setPostJobFormValue('skills', newSkills, { shouldValidate: true });
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Find Your Next Opportunity</h1>
        <Button onClick={() => setIsPostJobDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Post a New Job
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/>Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="titleFilter">Job Title</Label>
            <Select value={selectedTitle} onValueChange={setSelectedTitle}>
              <SelectTrigger id="titleFilter"><SelectValue placeholder="All Titles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Job Titles</SelectItem>
                {uniqueTitles.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="locationFilter">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="locationFilter"><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Locations</SelectItem>
                {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="jobTypeFilter">Job Type</Label>
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger id="jobTypeFilter"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Job Types</SelectItem>
                {uniqueJobTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div className="md:col-span-2 lg:col-span-3 xl:col-span-3">
            <Label>Skills/Keywords</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                    >
                        {selectedKeywords.length > 0 ? `${selectedKeywords.length} skill(s) selected` : "Select skills..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search skills..." />
                        <CommandEmpty>No skills found.</CommandEmpty>
                        <CommandList>
                            <ScrollArea className="h-48">
                                <CommandGroup>
                                    {allSkillsForFilter.map((skill) => (
                                    <CommandItem
                                        key={skill}
                                        value={skill}
                                        onSelect={() => toggleKeyword(skill)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedKeywords.includes(skill) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {skill}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">Job Listings ({filteredJobs.length > 0 ? `Showing ${filteredJobs.length} jobs` : 'No jobs match filters'})</h2>
        {isLoadingJobs && jobs.length === 0 ? ( 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <JobCardSkeleton key={i} />)}
            </div>
        ) : error ? (
             <Card className="text-center py-12 bg-destructive/10 border-destructive">
                <CardContent className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <p className="text-destructive font-semibold text-lg">Failed to load jobs</p>
                <p className="text-muted-foreground font-body">{error}</p>
                <Button onClick={() => fetchJobs()} variant="outline">Try Again</Button>
                </CardContent>
            </Card>
        ) : filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground font-body">No jobs match your current filters. Try adjusting your search or check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </section>

      {/* Post a New Job Dialog */}
      <Dialog open={isPostJobDialogOpen} onOpenChange={setIsPostJobDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Post a New Job</DialogTitle>
            <DialogDescription>
              Fill in the details below to post a new job opportunity.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handlePostJobSubmit)}>
            <ScrollArea className="max-h-[70vh] p-1 pr-3">
              <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobTitle" className="text-right">Title*</Label>
                  <div className="col-span-3">
                    <Input id="postJobTitle" {...register("title")} className={postJobErrors.title ? "border-destructive" : ""} />
                    {postJobErrors.title && <p className="text-xs text-destructive mt-1">{postJobErrors.title.message}</p>}
                  </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobCompany" className="text-right">Company*</Label>
                  <div className="col-span-3">
                    <Input id="postJobCompany" {...register("company")} className={postJobErrors.company ? "border-destructive" : ""} />
                    {postJobErrors.company && <p className="text-xs text-destructive mt-1">{postJobErrors.company.message}</p>}
                  </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobCompanyLogo" className="text-right">Logo URL</Label>
                  <Input id="postJobCompanyLogo" {...register("companyLogo")} className="col-span-3" placeholder="https://example.com/logo.png" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobLocation" className="text-right">Location*</Label>
                  <div className="col-span-3">
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} >
                                <SelectTrigger className={postJobErrors.location ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDIAN_CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {postJobErrors.location && <p className="text-xs text-destructive mt-1">{postJobErrors.location.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobType" className="text-right">Job Type*</Label>
                   <div className="col-span-3">
                     <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={postJobErrors.type ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {postJobErrors.type && <p className="text-xs text-destructive mt-1">{postJobErrors.type.message}</p>}
                   </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobDescription" className="text-right">Description*</Label>
                  <div className="col-span-3">
                    <Textarea id="postJobDescription" {...register("description")} className={`min-h-[100px] ${postJobErrors.description ? "border-destructive" : ""}`} />
                    {postJobErrors.description && <p className="text-xs text-destructive mt-1">{postJobErrors.description.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Skills*</Label>
                  <div className="col-span-3">
                    <Popover open={openSkillsPopover} onOpenChange={setOpenSkillsPopover}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSkillsPopover}
                                className={`w-full justify-between font-normal ${postJobErrors.skills ? "border-destructive" : ""}`}
                            >
                                {newJobSkills.length > 0 ? `${newJobSkills.length} skill(s) selected` : "Select skills..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search skills..." />
                                <CommandEmpty>No skills found.</CommandEmpty>
                                 <CommandList>
                                    <ScrollArea className="h-48">
                                    <CommandGroup>
                                        {IT_KEYWORDS.map((skill) => (
                                        <CommandItem
                                            key={skill}
                                            value={skill}
                                            onSelect={() => {
                                                toggleNewJobSkill(skill);
                                                setOpenSkillsPopover(true); // Keep popover open
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    (newJobSkills || []).includes(skill) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {skill}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    </ScrollArea>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {postJobErrors.skills && <p className="text-xs text-destructive mt-1">{postJobErrors.skills.message}</p>}
                     <div className="mt-2 flex flex-wrap gap-1">
                        {(newJobSkills || []).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                            <button type="button" onClick={() => toggleNewJobSkill(skill)} className="ml-1 opacity-70 hover:opacity-100">&times;</button>
                            </Badge>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postJobSalary" className="text-right">Salary</Label>
                  <Input id="postJobSalary" {...register("salary")} className="col-span-3" placeholder="e.g., ₹5LPA - ₹7LPA or Competitive" />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => { setIsPostJobDialogOpen(false); resetPostJobForm(); }}>Cancel</Button>
              <Button type="submit" disabled={isSubmittingJob}>
                {isSubmittingJob && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const { id, title, company, companyLogo, location, type, description, skills, postedDate, salary } = job;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        {companyLogo ? (
          <Image src={companyLogo} alt={`${company} logo`} width={48} height={48} className="rounded-md border object-contain bg-white" data-ai-hint="company logo"/>
        ) : (
          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
            <Building className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold font-headline leading-tight">{title || "N/A"}</CardTitle>
          <p className="text-sm text-muted-foreground">{company || "N/A"}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {location && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" /> {location}
          </div>
        )}
        {type && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <BriefcaseBusiness className="h-3 w-3 mr-1" /> {type}
          </div>
        )}
        {salary && <p className="text-xs text-muted-foreground mb-3">Salary: {salary}</p>}
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3 font-body">{description || "No description available."}</p>
        <div className="mt-2">
            <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Skills:</h4>
            <div className="flex flex-wrap gap-1">
            {skills?.slice(0, 3).map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
            {skills?.length > 3 && <Badge variant="outline" className="text-xs">+{skills.length - 3} more</Badge>}
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
         <p className="text-xs text-muted-foreground">
          Posted: {postedDate ? new Date(postedDate).toLocaleDateString() : 'N/A'}
        </p>
        <Button size="sm" variant="default" asChild>
          <Link href={`/jobs/${id}/apply`}>
            Apply Now
          </Link>
        </Button>
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
         <div className="h-6 bg-muted rounded w-full mt-2"></div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-8 w-24 bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
}

    