
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Building, MapPin, Search, PlusCircle, Filter, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp, serverTimestamp, query, where, orderBy, Query } from 'firebase/firestore';
import Link from 'next/link';
import { JOB_TITLES, INDIAN_CITIES, IT_KEYWORDS, JOB_TYPES, ALL_FILTER_VALUE } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  description: string;
  skills: string[]; // Changed from skillsRequired for consistency with constants
  postedDate: Date;
  salary?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Omit<Job, 'postedDate' | 'id' | 'skills'> & {postedDate?: Timestamp, skills?: string[]}>>({ skills: [] });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState(ALL_FILTER_VALUE);
  const [selectedLocation, setSelectedLocation] = useState(ALL_FILTER_VALUE);
  const [selectedJobType, setSelectedJobType] = useState(ALL_FILTER_VALUE);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      let jobsQuery: Query = collection(db, 'jobs');

      if (selectedTitle !== ALL_FILTER_VALUE) {
        jobsQuery = query(jobsQuery, where("title", "==", selectedTitle));
      }
      if (selectedLocation !== ALL_FILTER_VALUE) {
        jobsQuery = query(jobsQuery, where("location", "==", selectedLocation));
      }
      if (selectedJobType !== ALL_FILTER_VALUE) {
        jobsQuery = query(jobsQuery, where("type", "==", selectedJobType));
      }
      
      jobsQuery = query(jobsQuery, orderBy('postedDate', 'desc'));
      
      const jobSnapshot = await getDocs(jobsQuery);
      let jobList = jobSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          skills: data.skills || [], // ensure skills is an array
          postedDate: (data.postedDate as Timestamp)?.toDate ? (data.postedDate as Timestamp).toDate() : new Date(),
        } as Job;
      });

      // Client-side filtering for keywords (must contain ALL selected keywords)
      if (selectedKeywords.length > 0) {
        jobList = jobList.filter(job =>
          selectedKeywords.every(keyword => job.skills.includes(keyword))
        );
      }
      
      // Client-side filtering for search term (if any)
      if (searchTerm.trim() !== "") {
        const lowerSearchTerm = searchTerm.toLowerCase();
        jobList = jobList.filter(job => 
            job.title.toLowerCase().includes(lowerSearchTerm) ||
            job.company.toLowerCase().includes(lowerSearchTerm) ||
            job.description.toLowerCase().includes(lowerSearchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(lowerSearchTerm))
        );
      }

      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({ title: "Error", description: "Could not fetch jobs.", variant: "destructive" });
    } finally {
      setIsLoadingJobs(false);
    }
  }, [selectedTitle, selectedLocation, selectedJobType, selectedKeywords, searchTerm, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handlePostJobInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handlePostJobSelectChange = (name: string, value: string) => {
    setNewJob(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkillToJob = (skill: string) => {
    if (skill && !newJob.skills?.includes(skill)) {
      setNewJob(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
    }
  };

  const handleRemoveSkillFromJob = (skillToRemove: string) => {
    setNewJob(prev => ({ ...prev, skills: prev.skills?.filter(skill => skill !== skillToRemove) }));
  };

  const handlePostJobSubmit = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.type || !newJob.description) {
       toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsLoadingJobs(true); // Use general loading state
    try {
      const jobToPost = {
        ...newJob,
        skills: newJob.skills || [],
        postedDate: serverTimestamp(),
        companyLogo: newJob.companyLogo || `https://placehold.co/100x100.png?text=${newJob.company!.substring(0,2).toUpperCase()}`,
      };
      const docRef = await addDoc(collection(db, 'jobs'), jobToPost);
      
      setJobs(prevJobs => [{
        id: docRef.id,
        ...newJob,
        skills: newJob.skills || [],
        postedDate: new Date(), 
        companyLogo: jobToPost.companyLogo,
      } as Job, ...prevJobs]);

      toast({ title: "Job Posted", description: `"${newJob.title}" has been successfully posted.` });
      setIsPostJobDialogOpen(false);
      setNewJob({ skills: [] });
      fetchJobs(); // Refetch jobs to ensure filters are up-to-date if they were dynamic
    } catch (error) {
      console.error("Error posting job:", error);
      toast({ title: "Error", description: "Could not post job. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  const handleKeywordSelect = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword) 
        : [...prev, keyword]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Find Your Next Opportunity</h1>
        <Button onClick={() => setIsPostJobDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Post a Job
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/>Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="search">Search Keywords</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="search" 
                placeholder="Job title, company, skill..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="titleFilter">Job Title</Label>
            <Select value={selectedTitle} onValueChange={setSelectedTitle}>
              <SelectTrigger id="titleFilter"><SelectValue placeholder="All Titles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Titles</SelectItem>
                {JOB_TITLES.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="locationFilter">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="locationFilter"><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Locations</SelectItem>
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
          <div className="md:col-span-2 lg:col-span-4">
            <Label htmlFor="keywordsFilter">Keywords/Skills</Label>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {selectedKeywords.length > 0 ? `${selectedKeywords.length} skill(s) selected` : "Select skills..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[300px] max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Select Skills</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Consider adding a search input here for long lists */}
                    {IT_KEYWORDS.sort().map((keyword) => (
                    <DropdownMenuCheckboxItem
                        key={keyword}
                        checked={selectedKeywords.includes(keyword)}
                        onCheckedChange={() => handleKeywordSelect(keyword)}
                        onSelect={(e) => e.preventDefault()} // prevent menu closing on item select
                    >
                        {keyword}
                    </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">Job Listings ({jobs.length})</h2>
        {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <JobCardSkeleton key={i} />)}
            </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground font-body">No jobs match your current filters. Try adjusting your search or check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </section>

      <Dialog open={isPostJobDialogOpen} onOpenChange={setIsPostJobDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Post a New Job / Internship</DialogTitle>
            <DialogDescription>Fill in the details below to find the perfect candidate.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitlePost" className="text-right">Job Title</Label>
              <Select name="title" onValueChange={(value) => handlePostJobSelectChange("title", value)} value={newJob.title || undefined}>
                <SelectTrigger id="jobTitlePost" className="col-span-3"><SelectValue placeholder="Select job title" /></SelectTrigger>
                <SelectContent>
                  {JOB_TITLES.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">Company Name</Label>
              <Input id="companyName" name="company" value={newJob.company || ""} onChange={handlePostJobInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobLocationPost" className="text-right">Location</Label>
               <Select name="location" onValueChange={(value) => handlePostJobSelectChange("location", value)} value={newJob.location || undefined}>
                <SelectTrigger id="jobLocationPost" className="col-span-3"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {INDIAN_CITIES.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTypePost" className="text-right">Job Type</Label>
              <Select name="type" onValueChange={(value) => handlePostJobSelectChange("type", value)} value={newJob.type || undefined}>
                <SelectTrigger id="jobTypePost" className="col-span-3"><SelectValue placeholder="Select job type" /></SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">Salary / Stipend</Label>
              <Input id="salary" name="salary" value={newJob.salary || ""} onChange={handlePostJobInputChange} className="col-span-3" placeholder="e.g., ₹20,000/month or ₹5 LPA" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobDescription" className="text-right">Description</Label>
              <Textarea id="jobDescription" name="description" value={newJob.description || ""} onChange={handlePostJobInputChange} className="col-span-3 min-h-[100px]" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Skills Required</Label>
              <div className="col-span-3 space-y-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                        Add a skill...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                        <CommandInput placeholder="Search skill..." />
                        <CommandList>
                            <CommandEmpty>No skill found.</CommandEmpty>
                            <CommandGroup>
                            {IT_KEYWORDS.filter(skill => !(newJob.skills || []).includes(skill)).sort().map((skill) => (
                                <CommandItem
                                key={skill}
                                value={skill}
                                onSelect={(currentValue) => {
                                    handleAddSkillToJob(currentValue);
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    (newJob.skills || []).includes(skill) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {skill}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(newJob.skills || []).map(skill => (
                    <Badge key={skill} variant="default">
                      {skill}
                      <button onClick={() => handleRemoveSkillFromJob(skill)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostJobDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePostJobSubmit} disabled={isLoadingJobs}>
              {isLoadingJobs && newJob.title ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Post Job
            </Button>
          </DialogFooter>
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
          <Image src={companyLogo} alt={`${company} logo`} width={48} height={48} className="rounded-md border object-contain" data-ai-hint="company logo"/>
        ) : (
          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
            <Building className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold font-headline leading-tight">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3 mr-1" /> {location}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <BriefcaseBusiness className="h-3 w-3 mr-1" /> {type} {salary && `• ${salary}`}
        </div>
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3 font-body">{description}</p>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground">Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
            {skills.length > 4 && <Badge variant="outline" className="text-xs">+{skills.length - 4}</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Posted: {postedDate instanceof Date ? postedDate.toLocaleDateString() : 'N/A'}
        </p>
        <Button size="sm" variant="default" asChild>
          <Link href={`/jobs/${id}/apply`}>Apply Now</Link>
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
        <div className="h-3 bg-muted rounded w-1/4 mb-1"></div>
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-12 bg-muted rounded-full"></div>
          <div className="h-5 w-16 bg-muted rounded-full"></div>
          <div className="h-5 w-10 bg-muted rounded-full"></div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-8 w-24 bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
}
