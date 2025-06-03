
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, PlusCircle, Edit, Trash2, Video, Users, Clock, CalendarIcon, Info, Star, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { IT_KEYWORDS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WebinarSession {
  id: string;
  title: string;
  dateTime: Date;
  mode: 'Live' | 'Recorded' | 'Hybrid';
  skillsCovered: string[];
  topic: string;
  speakerName: string;
  speakerQualifications: string;
  sessionObjectives: string;
  maxAttendees?: number;
  status: 'Upcoming' | 'Past' | 'Live'; // Derived or set
  feedbackCollected?: boolean; // Placeholder
  avgRating?: number; // Placeholder
}

// Dummy data
const initialWebinars: WebinarSession[] = [
  { id: 'web1', title: 'Intro to Cloud with AWS', dateTime: new Date(2024, 8, 15, 14, 0), mode: 'Live', skillsCovered: ['AWS', 'Cloud Computing'], topic: "Cloud Fundamentals", speakerName: 'Dr. Cloud Expert', speakerQualifications: 'AWS Certified Solutions Architect', sessionObjectives: 'Understand core AWS services.', maxAttendees: 100, status: 'Upcoming' },
  { id: 'web2', title: 'Advanced React Patterns', dateTime: new Date(2024, 6, 20, 10, 0), mode: 'Recorded', skillsCovered: ['React', 'JavaScript'], topic: "Frontend Development", speakerName: 'Jane Developer', speakerQualifications: 'Senior Frontend Engineer', sessionObjectives: 'Learn advanced React techniques for performance.', status: 'Past', feedbackCollected: true, avgRating: 4.5 },
  { id: 'web3', title: 'Cybersecurity for Beginners', dateTime: new Date(Date.now() - 2 * 60 * 60 * 1000), mode: 'Live', skillsCovered: ['Cybersecurity', 'Networking'], topic: "Security Basics", speakerName: 'Securitas Prime', speakerQualifications: 'CISSP, Ethical Hacker', sessionObjectives: 'Basic concepts of cybersecurity threats and prevention.', status: 'Live' },
];

const sessionModes = ['Live', 'Recorded', 'Hybrid'] as const; // Renaming this might be good for consistency, but not critical if not user-facing

export default function ScheduleWebinarPage() {
  const [webinars, setWebinars] = useState<WebinarSession[]>(initialWebinars);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentWebinar, setCurrentWebinar] = useState<Partial<WebinarSession>>({ skillsCovered: [], mode: 'Live'});
  const [editingWebinarId, setEditingWebinarId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState<WebinarSession | null>(null);
  
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState<string>("Your Company");

  useEffect(() => {
    const name = localStorage.getItem('companyName');
    if (name) setCompanyName(name);
    // Logic to update webinar statuses based on current time could go here
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentWebinar(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (skill: string) => {
    setCurrentWebinar(prev => {
      const skills = prev.skillsCovered || [];
      if (skills.includes(skill)) {
        return { ...prev, skillsCovered: skills.filter(s => s !== skill) };
      }
      return { ...prev, skillsCovered: [...skills, skill] };
    });
  };

   const handleDateTimeChange = (date?: Date) => {
    if (date) {
      // Preserve time if already set, otherwise default to something like 09:00
      const currentTime = currentWebinar.dateTime ? { h: currentWebinar.dateTime.getHours(), m: currentWebinar.dateTime.getMinutes()} : {h: 9, m: 0};
      const newDateTime = new Date(date);
      newDateTime.setHours(currentTime.h, currentTime.m);
      setCurrentWebinar(prev => ({ ...prev, dateTime: newDateTime}));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value; // HH:mm
    if (timeValue && currentWebinar.dateTime) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDateTime = new Date(currentWebinar.dateTime);
      newDateTime.setHours(hours, minutes);
      setCurrentWebinar(prev => ({ ...prev, dateTime: newDateTime }));
    } else if (timeValue && !currentWebinar.dateTime) {
      // If date is not set yet, create a new date with today and this time
      const newDateTime = new Date();
      const [hours, minutes] = timeValue.split(':').map(Number);
      newDateTime.setHours(hours, minutes, 0, 0);
      setCurrentWebinar(prev => ({ ...prev, dateTime: newDateTime }));
    }
  };


  const handleSubmitWebinar = () => {
    // Basic validation
    if (!currentWebinar.title?.trim() || !currentWebinar.dateTime || !currentWebinar.mode || !currentWebinar.topic?.trim() || !currentWebinar.speakerName?.trim() || !currentWebinar.sessionObjectives?.trim()) {
      toast({ title: "Missing Fields", description: "Please fill all required fields for the webinar.", variant: "destructive" });
      return;
    }

    const webinarData: WebinarSession = {
      id: editingWebinarId || Date.now().toString(),
      title: currentWebinar.title!,
      dateTime: currentWebinar.dateTime!,
      mode: currentWebinar.mode!,
      skillsCovered: currentWebinar.skillsCovered || [],
      topic: currentWebinar.topic!,
      speakerName: currentWebinar.speakerName!,
      speakerQualifications: currentWebinar.speakerQualifications || "",
      sessionObjectives: currentWebinar.sessionObjectives!,
      maxAttendees: currentWebinar.maxAttendees,
      status: currentWebinar.dateTime > new Date() ? 'Upcoming' : 'Past', // Simplified status logic
    };

    if (editingWebinarId) {
      setWebinars(webinars.map(w => w.id === editingWebinarId ? webinarData : w));
      toast({ title: "Webinar Updated!", description: `"${webinarData.title}" has been successfully updated.` });
    } else {
      setWebinars([webinarData, ...webinars]);
      toast({ title: "Webinar Scheduled!", description: `"${webinarData.title}" has been scheduled.` });
    }
    setIsFormOpen(false);
    setCurrentWebinar({ skillsCovered: [], mode: 'Live'});
    setEditingWebinarId(null);
  };

  const openNewWebinarForm = () => {
    setCurrentWebinar({ skillsCovered: [], mode: 'Live', dateTime: undefined });
    setEditingWebinarId(null);
    setIsFormOpen(true);
  };

  const openEditWebinarForm = (webinar: WebinarSession) => {
    setCurrentWebinar({ ...webinar, dateTime: new Date(webinar.dateTime) });
    setEditingWebinarId(webinar.id);
    setIsFormOpen(true);
  };

  const confirmDeleteWebinar = (webinar: WebinarSession) => {
    setWebinarToDelete(webinar);
    setIsDeleting(true);
  };

  const handleDeleteWebinar = () => {
    if (webinarToDelete) {
      setWebinars(webinars.filter(w => w.id !== webinarToDelete.id));
      toast({ title: "Webinar Deleted", description: `"${webinarToDelete.title}" has been removed.`, variant: "destructive" });
    }
    setIsDeleting(false);
    setWebinarToDelete(null);
  };
  
  const upcomingWebinars = webinars.filter(w => w.status === 'Upcoming').sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  const pastWebinars = webinars.filter(w => w.status === 'Past').sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  const liveWebinars = webinars.filter(w => w.status === 'Live');


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <CalendarCheck2 className="mr-3 h-8 w-8 text-primary" /> Schedule & Manage Webinars
        </h1>
        <Button onClick={openNewWebinarForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Webinar
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Presentation className="mr-2 h-5 w-5 text-primary" /> Webinar Listings</CardTitle>
            <CardDescription>Manage your upcoming, past, and live webinars or mentorship programs.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Upcoming webinars ({upcomingWebinars.length}), Past webinars ({pastWebinars.length}), Live ({liveWebinars.length}) will be listed here with more details and filtering soon.</p>
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Example Upcoming Webinar:</h3>
                {upcomingWebinars.length > 0 ? (
                    <div className="border p-3 rounded-md bg-muted/30">
                        <p className="font-bold">{upcomingWebinars[0].title}</p>
                        <p className="text-sm">Date: {format(upcomingWebinars[0].dateTime, "PPPp")}</p>
                        <p className="text-sm">Speaker: {upcomingWebinars[0].speakerName}</p>
                    </div>
                ) : <p className="text-sm text-muted-foreground">No upcoming webinars.</p>}
            </div>
        </CardContent>
      </Card>

      {/* Add/Edit Webinar Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingWebinarId ? 'Edit Webinar' : 'Schedule New Webinar'}</DialogTitle>
            <DialogDescription>
              Provide details for the webinar or mentorship program.
            </DialogDescription>
          </DialogHeader>
           <ScrollArea className="max-h-[70vh] p-1 pr-3">
            <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="webinarTitle" className="text-right">Title*</Label>
                    <Input id="webinarTitle" name="title" value={currentWebinar.title || ""} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateTime" className="text-right">Date*</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("col-span-2 justify-start text-left font-normal", !currentWebinar.dateTime && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentWebinar.dateTime ? format(currentWebinar.dateTime, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={currentWebinar.dateTime}
                            onSelect={handleDateTimeChange}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                        />
                        </PopoverContent>
                    </Popover>
                    <Input 
                        type="time"
                        className="col-span-1"
                        value={currentWebinar.dateTime ? format(currentWebinar.dateTime, "HH:mm") : ""}
                        onChange={handleTimeChange}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mode" className="text-right">Mode*</Label>
                    <Select value={currentWebinar.mode} onValueChange={(value: WebinarSession['mode']) => setCurrentWebinar(prev => ({...prev, mode: value}))}>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Select mode"/></SelectTrigger>
                        <SelectContent>
                            {sessionModes.map(mode => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="topic" className="text-right">Main Topic*</Label>
                    <Input id="topic" name="topic" value={currentWebinar.topic || ""} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Web Development, AI, Career Skills" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Skills Covered</Label>
                    <div className="col-span-3 space-y-2">
                        <div className="flex flex-wrap gap-1">
                            {(currentWebinar.skillsCovered || []).map(skill => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                                <button onClick={() => handleSkillsChange(skill)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button>
                            </Badge>
                            ))}
                        </div>
                        <Select onValueChange={(value) => { if(value) handleSkillsChange(value); }}>
                            <SelectTrigger><SelectValue placeholder="Add a skill..."/></SelectTrigger>
                            <SelectContent>
                                {IT_KEYWORDS.filter(s => !(currentWebinar.skillsCovered || []).includes(s)).slice(0,20).map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="speakerName" className="text-right">Speaker Name*</Label>
                    <Input id="speakerName" name="speakerName" value={currentWebinar.speakerName || ""} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="speakerQualifications" className="text-right">Speaker Qualifications</Label>
                    <Input id="speakerQualifications" name="speakerQualifications" value={currentWebinar.speakerQualifications || ""} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Senior Developer @ XYZ, PhD in AI"/>
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="sessionObjectives" className="text-right pt-2">Objectives*</Label>
                    <Textarea id="sessionObjectives" name="sessionObjectives" value={currentWebinar.sessionObjectives || ""} onChange={handleInputChange} className="col-span-3 min-h-[100px]" placeholder="What will attendees learn?"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxAttendees" className="text-right">Max Attendees</Label>
                    <Input id="maxAttendees" name="maxAttendees" type="number" value={currentWebinar.maxAttendees || ""} onChange={handleInputChange} className="col-span-3" placeholder="Optional"/>
                </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitWebinar}>{editingWebinarId ? 'Save Changes' : 'Schedule Webinar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
       <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the webinar "{webinarToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteWebinar}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Star className="mr-2 h-5 w-5 text-yellow-400"/> Student Feedback & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Functionality to view student feedback and ratings for past webinars will be available here. This helps in improving future programs.</p>
            {/* Placeholder for feedback display */}
        </CardContent>
       </Card>
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Auto-Invite Feature</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">A feature to automatically invite students who follow related skills or domains to your upcoming webinars is planned. This will maximize reach and engagement.</p>
            {/* Placeholder for auto-invite settings */}
        </CardContent>
       </Card>
    </div>
  );
}
