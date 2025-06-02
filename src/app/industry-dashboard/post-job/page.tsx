
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, PlusCircle, Trash2, Filter, CalendarIcon, MapPin, Briefcase, Settings, Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { IT_KEYWORDS, INDIAN_CITIES, JOB_TYPES, ALL_FILTER_VALUE } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobPosting {
  id: string;
  title: string;
  location: string; // 'Remote', 'Hybrid', 'On-Site - City'
  locationType: 'Remote' | 'Hybrid' | 'On-Site';
  city?: string; // Only if On-Site
  skillsRequired: string[];
  duration: string; // e.g., "3 Months", "6 Months", "Full-time"
  stipend: string; // e.g., "₹10,000/month", "Competitive", "Unpaid"
  applicationDeadline?: Date;
  description: string;
  postedBy: string; // Company name or ID
  postedDate: Date;
  status: 'Open' | 'Closed';
}

// Dummy data - in a real app, this would come from Firebase
const initialJobPostings: JobPosting[] = [
  { id: 'job1', title: 'Frontend Developer Intern', locationType: 'Remote', location: 'Remote', skillsRequired: ['React', 'JavaScript', 'HTML', 'CSS'], duration: '3 Months', stipend: '₹15,000/month', applicationDeadline: new Date(2024, 8, 30), description: 'Work on exciting frontend projects.', postedBy: 'Tech Solutions Inc.', postedDate: new Date(2024, 6, 1), status: 'Open' },
  { id: 'job2', title: 'Backend Developer (Node.js)', locationType: 'On-Site', city: 'Bengaluru', location: 'On-Site - Bengaluru', skillsRequired: ['Node.js', 'Express', 'MongoDB'], duration: 'Full-time', stipend: '₹6-8 LPA', description: 'Develop scalable backend services.', postedBy: 'Innovate Labs', postedDate: new Date(2024, 5, 20), status: 'Open' },
  { id: 'job3', title: 'UI/UX Design Intern', locationType: 'Hybrid', city: 'Pune', location: 'Hybrid - Pune', skillsRequired: ['Figma', 'User Research', 'Prototyping'], duration: '6 Months', stipend: '₹10,000/month', applicationDeadline: new Date(2024, 7, 15), description: 'Design user-friendly interfaces.', postedBy: 'Creative Designs Co.', postedDate: new Date(2024, 6, 10), status: 'Closed' },
];

const locationTypes = ['Remote', 'Hybrid', 'On-Site'] as const;

export default function PostJobPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<JobPosting>>({ skillsRequired: [], locationType: 'Remote', status: 'Open' });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobPosting | null>(null);

  // Filters
  const [filterDomain, setFilterDomain] = useState(ALL_FILTER_VALUE);
  const [filterStipend, setFilterStipend] = useState(ALL_FILTER_VALUE); // Example: "0-10k", "10k-20k", "20k+"
  const [filterDuration, setFilterDuration] = useState(ALL_FILTER_VALUE);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);

  const { toast } = useToast();
  const [companyName, setCompanyName] = useState<string>("Your Company"); // Placeholder

  useEffect(() => {
    const name = localStorage.getItem('companyName');
    if (name) setCompanyName(name);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentJob(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationTypeChange = (value: JobPosting['locationType']) => {
    setCurrentJob(prev => ({ ...prev, locationType: value, city: value === 'On-Site' ? prev.city : undefined }));
  };

  const handleSkillsChange = (skill: string) => {
    setCurrentJob(prev => {
      const skills = prev.skillsRequired || [];
      if (skills.includes(skill)) {
        return { ...prev, skillsRequired: skills.filter(s => s !== skill) };
      }
      return { ...prev, skillsRequired: [...skills, skill] };
    });
  };

  const handleSubmitJob = () => {
    if (!currentJob.title?.trim() || !currentJob.locationType || !currentJob.duration?.trim() || !currentJob.stipend?.trim() || !currentJob.description?.trim()) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (currentJob.locationType === 'On-Site' && !currentJob.city?.trim()) {
        toast({ title: "Missing City", description: "Please specify city for On-Site location.", variant: "destructive"});
        return;
    }

    const jobData: JobPosting = {
      id: editingJobId || Date.now().toString(),
      title: currentJob.title!,
      locationType: currentJob.locationType!,
      city: currentJob.locationType === 'On-Site' ? currentJob.city : undefined,
      location: currentJob.locationType === 'On-Site' ? `On-Site - ${currentJob.city}` : currentJob.locationType,
      skillsRequired: currentJob.skillsRequired || [],
      duration: currentJob.duration!,
      stipend: currentJob.stipend!,
      applicationDeadline: currentJob.applicationDeadline,
      description: currentJob.description!,
      postedBy: companyName, 
      postedDate: editingJobId ? jobPostings.find(j => j.id === editingJobId)!.postedDate : new Date(),
      status: currentJob.status || 'Open',
    };

    if (editingJobId) {
      setJobPostings(jobPostings.map(j => j.id === editingJobId ? jobData : j));
      toast({ title: "Job Updated!", description: `"${jobData.title}" has been updated.` });
    } else {
      setJobPostings([jobData, ...jobPostings]);
      toast({ title: "Job Posted!", description: `"${jobData.title}" is now live.` });
    }
    setIsFormOpen(false);
    setCurrentJob({ skillsRequired: [], locationType: 'Remote', status: 'Open' });
    setEditingJobId(null);
  };
  
  const openNewJobForm = () => {
    setCurrentJob({ skillsRequired: [], locationType: 'Remote', status: 'Open', applicationDeadline: undefined });
    setEditingJobId(null);
    setIsFormOpen(true);
  };

  const openEditJobForm = (job: JobPosting) => {
    setCurrentJob({ ...job, applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : undefined });
    setEditingJobId(job.id);
    setIsFormOpen(true);
  };

  const confirmDeleteJob = (job: JobPosting) => {
    setJobToDelete(job);
    setIsDeleting(true);
  };

  const handleDeleteJob = () => {
    if (jobToDelete) {
      setJobPostings(jobPostings.filter(j => j.id !== jobToDelete.id));
      toast({ title: "Job Deleted", description: `"${jobToDelete.title}" has been removed.`, variant: "destructive" });
    }
    setIsDeleting(false);
    setJobToDelete(null);
  };

  const filteredJobList = useMemo(() => {
    return jobPostings.filter(job => {
      const matchesDomain = filterDomain === ALL_FILTER_VALUE || (job.skillsRequired.includes(filterDomain) || job.title.toLowerCase().includes(filterDomain.toLowerCase())); // Simple domain check
      // Stipend and duration filters would need more complex range logic if not exact matches
      const matchesStipend = filterStipend === ALL_FILTER_VALUE || job.stipend.toLowerCase().includes(filterStipend.toLowerCase());
      const matchesDuration = filterDuration === ALL_FILTER_VALUE || job.duration.toLowerCase().includes(filterDuration.toLowerCase());
      const matchesSkills = filterSkills.length === 0 || filterSkills.every(skill => job.skillsRequired.includes(skill));
      return matchesDomain && matchesStipend && matchesDuration && matchesSkills;
    });
  }, [jobPostings, filterDomain, filterStipend, filterDuration, filterSkills]);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Edit className="mr-3 h-8 w-8 text-primary" /> Post & Manage Opportunities
        </h1>
        <Button onClick={openNewJobForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5 text-primary" /> Filter Listings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Placeholder for filter inputs */}
          <Input placeholder="Filter by Domain (e.g., Web Dev)" onChange={e => setFilterDomain(e.target.value || ALL_FILTER_VALUE)} />
          <Input placeholder="Filter by Stipend (e.g., 10k)" onChange={e => setFilterStipend(e.target.value || ALL_FILTER_VALUE)} />
          <Input placeholder="Filter by Duration (e.g., 3 Months)" onChange={e => setFilterDuration(e.target.value || ALL_FILTER_VALUE)} />
          <Select onValueChange={value => setFilterSkills(value === ALL_FILTER_VALUE ? [] : [value])}>
            <SelectTrigger><SelectValue placeholder="Filter by Skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All Skills</SelectItem>
              {IT_KEYWORDS.slice(0,10).map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Posted Opportunities ({filteredJobList.length})</CardTitle>
          <CardDescription>View, edit, or delete your job and internship listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Stipend</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobList.length > 0 ? filteredJobList.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                    <TableCell className="hidden lg:table-cell">{job.stipend}</TableCell>
                    <TableCell>
                      <Badge variant={job.status === 'Open' ? 'default' : 'outline'}
                       className={cn(job.status === 'Open' ? 'bg-green-500/20 text-green-700 border-green-500/50' : 'bg-red-500/20 text-red-700 border-red-500/50')}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={() => openEditJobForm(job)}>
                        <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDeleteJob(job)}>
                        <Trash2 className="h-4 w-4 text-destructive" /> <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No job listings found. Create one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Job Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingJobId ? 'Edit Opportunity' : 'Post New Opportunity'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the job or internship listing.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 pr-3">
            <div className="grid gap-4 py-4 ">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobTitle" className="text-right">Title*</Label>
                <Input id="jobTitle" name="title" value={currentJob.title || ""} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="locationType" className="text-right">Location Type*</Label>
                <Select value={currentJob.locationType} onValueChange={handleLocationTypeChange}>
                  <SelectTrigger className="col-span-3"> <SelectValue placeholder="Select type" /> </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {currentJob.locationType === 'On-Site' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">City*</Label>
                  <Select value={currentJob.city} onValueChange={(value) => setCurrentJob(prev => ({...prev, city: value}))}>
                      <SelectTrigger className="col-span-3"><SelectValue placeholder="Select city"/></SelectTrigger>
                      <SelectContent>
                          {INDIAN_CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                  </Select>
                </div>
              )}
               {currentJob.locationType === 'Hybrid' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cityHybrid" className="text-right">Primary City</Label>
                   <Select value={currentJob.city} onValueChange={(value) => setCurrentJob(prev => ({...prev, city: value}))}>
                      <SelectTrigger className="col-span-3"><SelectValue placeholder="Select primary city for hybrid"/></SelectTrigger>
                      <SelectContent>
                          {INDIAN_CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                      </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Skills Required*</Label>
                <div className="col-span-3 space-y-2">
                    <div className="flex flex-wrap gap-1">
                        {(currentJob.skillsRequired || []).map(skill => (
                        <Badge key={skill} variant="secondary">
                            {skill}
                            <button onClick={() => handleSkillsChange(skill)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button>
                        </Badge>
                        ))}
                    </div>
                    <Select onValueChange={(value) => { if(value) handleSkillsChange(value); }}>
                        <SelectTrigger><SelectValue placeholder="Add a skill..."/></SelectTrigger>
                        <SelectContent>
                            {IT_KEYWORDS.filter(s => !(currentJob.skillsRequired || []).includes(s)).slice(0,20).map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Select from list or type and add custom skills (feature for custom add later).</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration*</Label>
                <Input id="duration" name="duration" value={currentJob.duration || ""} onChange={handleInputChange} className="col-span-3" placeholder="e.g., 3 Months, Full-time"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stipend" className="text-right">Stipend/Salary*</Label>
                <Input id="stipend" name="stipend" value={currentJob.stipend || ""} onChange={handleInputChange} className="col-span-3" placeholder="e.g., ₹10,000/month, Competitive"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicationDeadline" className="text-right">Deadline</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("col-span-3 justify-start text-left font-normal", !currentJob.applicationDeadline && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentJob.applicationDeadline ? format(currentJob.applicationDeadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={currentJob.applicationDeadline}
                        onSelect={(date) => setCurrentJob(prev => ({ ...prev, applicationDeadline: date }))}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                    />
                    </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description*</Label>
                <Textarea id="description" name="description" value={currentJob.description || ""} onChange={handleInputChange} className="col-span-3 min-h-[120px]" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select value={currentJob.status || 'Open'} onValueChange={(value: JobPosting['status']) => setCurrentJob(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitJob}>{editingJobId ? 'Save Changes' : 'Post Opportunity'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting for "{jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteJob}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
