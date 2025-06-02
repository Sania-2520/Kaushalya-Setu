
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Building, MapPin, Search, PlusCircle, SlidersHorizontal, Zap, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { recommendOpportunities, RecommendOpportunitiesInput, RecommendOpportunitiesOutput } from '@/ai/flows/smart-recommendation-engine';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp, serverTimestamp, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time" | string; // Allow string for dynamic values
  description: string;
  skillsRequired: string[];
  postedDate: Date; // Will be converted from Firestore Timestamp
  salary?: string;
}

interface RecommendedJob extends Job {
  relevanceScore: number;
}

// Dummy student data for recommendations - keep this for now as AI feature is separate
const dummyStudentProfile = {
  skills: ["React", "Node.js", "JavaScript", "HTML", "CSS", "Flutter"],
  portfolio: "Developed a full-stack e-commerce website and a mobile weather app.",
  desiredJobType: "Internship"
};

const ALL_FILTER_VALUE = "ALL_FILTER_VALUE"; // For all dropdowns

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Omit<Job, 'postedDate' | 'id'> & {postedDate?: Timestamp}>>({ skillsRequired: [] });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [titleFilter, setTitleFilter] = useState(ALL_FILTER_VALUE);
  const [locationFilter, setLocationFilter] = useState(ALL_FILTER_VALUE);
  const [jobTypeFilter, setJobTypeFilter] = useState(ALL_FILTER_VALUE);

  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const jobsCollection = collection(db, 'jobs');
        const q = query(jobsCollection, orderBy('postedDate', 'desc'));
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
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({ title: "Error", description: "Could not fetch jobs from database.", variant: "destructive" });
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
    fetchRecommendations();
  }, [toast]);

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const input: RecommendOpportunitiesInput = {
        studentSkills: dummyStudentProfile.skills,
        portfolioContent: dummyStudentProfile.portfolio,
        desiredJobType: dummyStudentProfile.desiredJobType,
      };
      // This is a dummy call, as real recommendations would depend on actual job listings
      // For now, we'll use the existing logic that might not perfectly map to Firestore jobs
      const output: RecommendOpportunitiesOutput = await recommendOpportunities(input);
      const mappedRecommendations: RecommendedJob[] = output.recommendations.map((rec, index) => ({
        id: `rec-${index}-${Date.now()}`,
        title: rec.jobTitle,
        company: rec.companyName,
        location: "Karnataka (Suggested)", 
        type: dummyStudentProfile.desiredJobType as Job["type"],
        description: rec.description,
        skillsRequired: dummyStudentProfile.skills.filter(skill => rec.description.toLowerCase().includes(skill.toLowerCase())),
        postedDate: new Date(),
        relevanceScore: rec.relevanceScore,
        companyLogo: `https://placehold.co/100x100.png?text=${rec.companyName.substring(0,2).toUpperCase()}`,
      }));
      setRecommendedJobs(mappedRecommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      toast({ title: "Recommendation Error", description: "Could not fetch AI job recommendations.", variant: "destructive" });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handlePostJobInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handlePostJobSelectChange = (name: string, value: string) => {
    setNewJob(prev => ({ ...prev, [name]: value as Job["type"] }));
  };
  
  const handleAddSkillToJob = (skill: string) => {
    if (skill && !newJob.skillsRequired?.includes(skill)) {
      setNewJob(prev => ({ ...prev, skillsRequired: [...(prev.skillsRequired || []), skill] }));
    }
  };

  const handleRemoveSkillFromJob = (skillToRemove: string) => {
    setNewJob(prev => ({ ...prev, skillsRequired: prev.skillsRequired?.filter(skill => skill !== skillToRemove) }));
  };

  const handlePostJobSubmit = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.type || !newJob.description) {
       toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const jobToPost = {
        ...newJob,
        postedDate: serverTimestamp(), // Use server timestamp for consistency
        companyLogo: newJob.companyLogo || `https://placehold.co/100x100.png?text=${newJob.company!.substring(0,2).toUpperCase()}`,
      };
      const docRef = await addDoc(collection(db, 'jobs'), jobToPost);
      
      // Add to local state for immediate UI update
      setJobs(prevJobs => [{
        id: docRef.id,
        title: newJob.title!,
        company: newJob.company!,
        location: newJob.location!,
        type: newJob.type as Job["type"],
        description: newJob.description!,
        skillsRequired: newJob.skillsRequired || [],
        postedDate: new Date(), // Optimistic update, Firestore will have server timestamp
        companyLogo: jobToPost.companyLogo,
        salary: newJob.salary
      }, ...prevJobs]);

      toast({ title: "Job Posted", description: `"${newJob.title}" has been successfully posted.` });
      setIsPostJobDialogOpen(false);
      setNewJob({ skillsRequired: [] });
    } catch (error) {
      console.error("Error posting job:", error);
      toast({ title: "Error", description: "Could not post job. Please try again.", variant: "destructive" });
    }
  };
  
  const uniqueTitles = useMemo(() => Array.from(new Set(jobs.map(job => job.title))), [jobs]);
  const uniqueLocations = useMemo(() => Array.from(new Set(jobs.map(job => job.location))), [jobs]);
  const uniqueJobTypes = useMemo(() => Array.from(new Set(jobs.map(job => job.type))), [jobs]);

  const filteredJobs = useMemo(() => jobs.filter(job => {
    const searchTermMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const titleMatch = titleFilter === ALL_FILTER_VALUE || job.title === titleFilter;
    const locationMatch = locationFilter === ALL_FILTER_VALUE || job.location === locationFilter;
    const jobTypeMatch = jobTypeFilter === ALL_FILTER_VALUE || job.type === jobTypeFilter;

    return searchTermMatch && titleMatch && locationMatch && jobTypeMatch;
  }), [jobs, searchTerm, titleFilter, locationFilter, jobTypeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Find Your Next Opportunity</h1>
        <Button onClick={() => setIsPostJobDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Post a Job (for Employers)
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-4 lg:col-span-1">
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
            <Select value={titleFilter} onValueChange={setTitleFilter}>
              <SelectTrigger id="titleFilter"><SelectValue placeholder="All Titles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Titles</SelectItem>
                {uniqueTitles.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="locationFilter">Location</Label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger id="locationFilter"><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Locations</SelectItem>
                {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="jobTypeFilter">Job Type</Label>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger id="jobTypeFilter"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Types</SelectItem>
                {uniqueJobTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {dummyStudentProfile && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold font-headline">Recommended For You</h2>
          </div>
          {isLoadingRecommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <JobCardSkeleton key={i} />)}
            </div>
          ) : recommendedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map(job => <JobCard key={job.id} job={job} isRecommended={true} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific recommendations available right now. Explore all jobs below!</p>
          )}
        </section>
      )}
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">All Job Listings ({filteredJobs.length})</h2>
        {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <JobCardSkeleton key={i} />)}
            </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground font-body">No jobs match your current filters. Try adjusting your search or check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
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
              <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
              <Input id="jobTitle" name="title" value={newJob.title || ""} onChange={handlePostJobInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">Company Name</Label>
              <Input id="companyName" name="company" value={newJob.company || ""} onChange={handlePostJobInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobLocation" className="text-right">Location</Label>
              <Input id="jobLocation" name="location" value={newJob.location || ""} onChange={handlePostJobInputChange} className="col-span-3" placeholder="e.g., Bengaluru, Karnataka" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTypePost" className="text-right">Job Type</Label>
              <Select name="type" onValueChange={(value) => handlePostJobSelectChange("type", value)} value={newJob.type || undefined}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select job type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
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
                <div className="flex items-center gap-2">
                    <Input 
                        type="text" 
                        placeholder="Add required skill and press Enter" 
                        className="text-sm h-8"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                handleAddSkillToJob(e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                 </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(newJob.skillsRequired || []).map(skill => (
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
            <Button onClick={handlePostJobSubmit}>Post Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface JobCardProps {
  job: Job | RecommendedJob;
  isRecommended?: boolean;
}

function JobCard({ job, isRecommended }: JobCardProps) {
  const { id, title, company, companyLogo, location, type, description, skillsRequired, postedDate, salary } = job;
  const relevanceScore = (job as RecommendedJob).relevanceScore;

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
        {isRecommended && relevanceScore && (
          <Badge variant="default" className="bg-green-500 text-white">
            {Math.round(relevanceScore * 100)}% Match
          </Badge>
        )}
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
            {skillsRequired.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
            {skillsRequired.length > 4 && <Badge variant="outline" className="text-xs">+{skillsRequired.length - 4}</Badge>}
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
