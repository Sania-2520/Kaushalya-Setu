
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Building, MapPin, Search, PlusCircle, SlidersHorizontal, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { recommendOpportunities, RecommendOpportunitiesInput, RecommendOpportunitiesOutput } from '@/ai/flows/smart-recommendation-engine';
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time";
  description: string;
  skillsRequired: string[];
  postedDate: Date;
  salary?: string;
}

interface RecommendedJob extends Job {
  relevanceScore: number;
}

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Tech Solutions Inc.",
    companyLogo: "https://placehold.co/100x100.png?text=TSI",
    location: "Bengaluru, Karnataka",
    type: "Internship",
    description: "Join our dynamic team to work on exciting frontend projects using modern JavaScript frameworks. Learn from experienced developers and contribute to real-world applications.",
    skillsRequired: ["HTML", "CSS", "JavaScript", "React", "Git"],
    postedDate: new Date(2024, 6, 15),
    salary: "₹15,000 - ₹25,000/month"
  },
  {
    id: "2",
    title: "Junior Software Engineer",
    company: "Innovate Hub",
    companyLogo: "https://placehold.co/100x100.png?text=IH",
    location: "Mysuru, Karnataka",
    type: "Full-time",
    description: "We are looking for a passionate Junior Software Engineer to design, develop, and maintain software solutions. This is a great opportunity for growth and learning.",
    skillsRequired: ["Java", "Spring Boot", "SQL", "Problem Solving"],
    postedDate: new Date(2024, 6, 10),
    salary: "₹4.5 LPA - ₹6 LPA"
  },
  {
    id: "3",
    title: "Graphic Design Intern",
    company: "Creative Minds Agency",
    location: "Hubballi, Karnataka",
    type: "Internship",
    description: "Assist our design team in creating compelling visuals for various clients. Must have a strong portfolio and proficiency in Adobe Creative Suite.",
    skillsRequired: ["Adobe Photoshop", "Adobe Illustrator", "Creativity", "Communication"],
    postedDate: new Date(2024, 6, 20),
  },
];

// Dummy student data for recommendations
const dummyStudentProfile = {
  skills: ["React", "Node.js", "JavaScript", "HTML", "CSS", "Flutter"],
  portfolio: "Developed a full-stack e-commerce website and a mobile weather app.",
  desiredJobType: "Internship"
};

const ALL_TYPES_FILTER_VALUE = "ALL_TYPES_FILTER_VALUE";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({ skillsRequired: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState(""); // Initial empty string shows placeholder

  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const input: RecommendOpportunitiesInput = {
        studentSkills: dummyStudentProfile.skills,
        portfolioContent: dummyStudentProfile.portfolio,
        desiredJobType: dummyStudentProfile.desiredJobType,
      };
      const output: RecommendOpportunitiesOutput = await recommendOpportunities(input);
      // Map AI output to our Job structure, assuming some fields might not be present in AI response
      const mappedRecommendations: RecommendedJob[] = output.recommendations.map((rec, index) => ({
        id: `rec-${index}-${Date.now()}`,
        title: rec.jobTitle,
        company: rec.companyName,
        location: "Karnataka (Suggested)", // Placeholder as AI might not give exact location
        type: dummyStudentProfile.desiredJobType as "Internship" | "Full-time" | "Part-time",
        description: rec.description,
        skillsRequired: dummyStudentProfile.skills.filter(skill => rec.description.toLowerCase().includes(skill.toLowerCase())), // Basic skill match
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
    setNewJob(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkillToJob = (skill: string) => {
    if (skill && !newJob.skillsRequired?.includes(skill)) {
      setNewJob(prev => ({ ...prev, skillsRequired: [...(prev.skillsRequired || []), skill] }));
    }
  };

  const handleRemoveSkillFromJob = (skillToRemove: string) => {
    setNewJob(prev => ({ ...prev, skillsRequired: prev.skillsRequired?.filter(skill => skill !== skillToRemove) }));
  };

  const handlePostJobSubmit = () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.type || !newJob.description) {
       toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const jobToPost: Job = {
      id: Date.now().toString(),
      title: newJob.title!,
      company: newJob.company!,
      location: newJob.location!,
      type: newJob.type as "Internship" | "Full-time" | "Part-time",
      description: newJob.description!,
      skillsRequired: newJob.skillsRequired || [],
      postedDate: new Date(),
      companyLogo: newJob.companyLogo || `https://placehold.co/100x100.png?text=${newJob.company!.substring(0,2).toUpperCase()}`,
      salary: newJob.salary
    };
    setJobs([jobToPost, ...jobs]);
    toast({ title: "Job Posted", description: `"${jobToPost.title}" has been successfully posted.` });
    setIsPostJobDialogOpen(false);
    setNewJob({ skillsRequired: [] });
  };
  
  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const showAllJobTypes = jobTypeFilter === "" || jobTypeFilter === ALL_TYPES_FILTER_VALUE;
    const jobTypeMatch = showAllJobTypes || job.type === jobTypeFilter;

    return titleMatch && locationMatch && jobTypeMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Find Your Next Opportunity</h1>
        <Button onClick={() => setIsPostJobDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Post a Job (for Employers)
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search">Search Jobs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="search" 
                placeholder="Job title, keywords..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="e.g., Bengaluru" 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger id="jobType">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_FILTER_VALUE}>All Types</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <Button className="md:mt-6">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Apply Filters
          </Button> */}
        </CardContent>
      </Card>

      {/* Recommended Jobs Section */}
      {dummyStudentProfile && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold font-headline">Recommended For You</h2>
          </div>
          {isLoadingRecommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader><div className="h-6 bg-muted rounded w-3/4"></div></CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter><div className="h-8 bg-muted rounded w-1/4"></div></CardFooter>
                </Card>
              ))}
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
      
      {/* All Jobs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">All Job Listings ({filteredJobs.length})</h2>
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center space-y-4">
              <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground font-body">No jobs match your current filters. Try adjusting your search!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </section>

      {/* Post Job Dialog */}
      <Dialog open={isPostJobDialogOpen} onOpenChange={setIsPostJobDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Post a New Job / Internship</DialogTitle>
            <DialogDescription>
              Fill in the details below to find the perfect candidate.
            </DialogDescription>
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
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" name="location" value={newJob.location || ""} onChange={handlePostJobInputChange} className="col-span-3" placeholder="e.g., Bengaluru, Karnataka" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTypePost" className="text-right">Job Type</Label>
              <Select name="type" onValueChange={(value) => handlePostJobSelectChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
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
                        placeholder="Add required skill" 
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

// Job Card Component
interface JobCardProps {
  job: Job | RecommendedJob;
  isRecommended?: boolean;
}

function JobCard({ job, isRecommended }: JobCardProps) {
  const { title, company, companyLogo, location, type, description, skillsRequired, postedDate, salary } = job;
  const relevanceScore = (job as RecommendedJob).relevanceScore;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        {companyLogo ? (
          <Image src={companyLogo} alt={`${company} logo`} width={48} height={48} className="rounded-md border" data-ai-hint="company logo" />
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
          Posted: {postedDate.toLocaleDateString()}
        </p>
        <Button size="sm" variant="default">Apply Now</Button>
      </CardFooter>
    </Card>
  );
}

