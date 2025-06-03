
"use client";

import { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileSignature, User, GraduationCap, Briefcase, FolderKanban, ListChecks, Languages, Award, PlusCircle, Save, Eye, Printer, Palette, Trash2, Link as LinkIcon } from "lucide-react";
import { IT_KEYWORDS } from '@/lib/constants'; 
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  profilePictureUrl?: string; 
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ProjectEntry {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  link: string;
}

interface CertificationEntry {
  id: string;
  name: string;
  platform: string;
  date: string;
}

interface LanguageEntry {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent' | '';
}

interface AchievementEntry {
    id: string;
    description: string;
}

interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  educationEntries: EducationEntry[];
  experienceEntries: ExperienceEntry[];
  projectEntries: ProjectEntry[];
  skills: string[];
  certificationEntries: CertificationEntry[];
  languageEntries: LanguageEntry[];
  achievementEntries: AchievementEntry[];
  updatedAt?: Timestamp;
}


export default function ResumeBuilderPage() {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null); // Simulate user ID
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Resume State
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({ fullName: "", email: "", phone: "", address: "", linkedin: "", github: "" });
  const [summary, setSummary] = useState("");
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectEntry[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>([]);
  const [languageEntries, setLanguageEntries] = useState<LanguageEntry[]>([]);
  const [achievementEntries, setAchievementEntries] = useState<AchievementEntry[]>([]);

  const [currentSkill, setCurrentSkill] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

   useEffect(() => {
    // Simulate fetching userId after component mounts (e.g., from auth context)
    const simulatedUserId = localStorage.getItem('userId') || "testUser123"; // Replace with actual auth
    if (simulatedUserId) {
      setUserId(simulatedUserId);
      loadResumeData(simulatedUserId);
    } else {
        // Handle case where user is not logged in, or redirect
        toast({ title: "User not identified", description: "Please log in to manage your resume.", variant: "destructive"});
    }
  }, []);


  const loadResumeData = async (uid: string) => {
    setIsLoading(true);
    try {
      const resumeRef = doc(db, 'resumes', uid);
      const resumeSnap = await getDoc(resumeRef);
      if (resumeSnap.exists()) {
        const data = resumeSnap.data() as ResumeData;
        setPersonalDetails(data.personalDetails || { fullName: "", email: "", phone: "", address: "", linkedin: "", github: "" });
        setSummary(data.summary || "");
        setEducationEntries(data.educationEntries || []);
        setExperienceEntries(data.experienceEntries || []);
        setProjectEntries(data.projectEntries || []);
        setSkills(data.skills || []);
        setCertificationEntries(data.certificationEntries || []);
        setLanguageEntries(data.languageEntries || []);
        setAchievementEntries(data.achievementEntries || []);
        if (data.personalDetails?.profilePictureUrl) {
            setProfilePicturePreview(data.personalDetails.profilePictureUrl); // Assuming URL is stored
        }
        toast({ title: "Resume Loaded", description: "Your saved resume data has been loaded." });
      } else {
        toast({ title: "No Saved Resume", description: "Start building your new resume!" });
      }
    } catch (error) {
      console.error("Error loading resume: ", error);
      toast({ title: "Error", description: "Could not load your resume.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResume = async () => {
    if (!userId) {
        toast({ title: "Cannot Save", description: "User not identified. Please log in.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    const resumeDataToSave: ResumeData = {
      personalDetails: {
        ...personalDetails,
        profilePictureUrl: profilePicturePreview || undefined // Store preview URL or actual storage URL if implemented
      },
      summary,
      educationEntries,
      experienceEntries,
      projectEntries,
      skills,
      certificationEntries,
      languageEntries,
      achievementEntries,
      updatedAt: serverTimestamp() as Timestamp
    };
    try {
      await setDoc(doc(db, 'resumes', userId), resumeDataToSave, { merge: true });
      toast({ title: "Resume Saved!", description: "Your resume has been saved to the cloud." });
    } catch (error) {
      console.error("Error saving resume: ", error);
      toast({ title: "Save Failed", description: "Could not save your resume.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };


  const handlePersonalDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (optional, can be more robust)
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast({title: "Image too large", description: "Please select an image smaller than 2MB.", variant: "destructive"});
        return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Note: Actual upload to Firebase Storage would happen here or on save
      toast({title: "Image Selected", description: "Image preview updated. Cloud storage for images coming soon."});
    }
  };

  // Generic handlers for array sections
  const addEntry = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, newEntry: Omit<T, 'id'>) => {
    setter(prev => [...prev, { ...newEntry, id: Date.now().toString() } as T]);
  };

  const removeEntry = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
    setter(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntry = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, field: keyof T, value: any) => {
    setter(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const handleAddSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleExportPdf = () => {
    toast({ 
      title: "Exporting Resume", 
      description: "Your browser's print dialog will open. Please select 'Save as PDF' as the destination." 
    });
    window.print(); // This will try to print the whole page, including UI. Needs specific print CSS or a dedicated PDF generation library for a clean resume.
  };

  if (isLoading && !userId) { // Show loading only if userId is not yet set (initial auth check)
    return <div className="flex justify-center items-center h-screen"><p>Loading user data...</p></div>;
  }


  return (
    <div className="space-y-8 print:space-y-0">
      <Card className="shadow-lg print:shadow-none print:border-none">
        <CardHeader className="print:hidden">
          <div className="flex items-center gap-3">
            <FileSignature className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Resume Builder</CardTitle>
              <CardDescription className="mt-1 text-sm md:text-base">
                Create a professional resume. Fill out sections, preview live, save to cloud, and export.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Sections */}
        <div className="lg:col-span-3 space-y-6 print:hidden">
          <Accordion type="multiple" defaultValue={['personal-details']} className="w-full">
            {/* Personal Details */}
            <AccordionItem value="personal-details">
              <AccordionTrigger className="font-semibold text-lg"><User className="mr-2 h-5 w-5 text-primary" />Personal Details</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" value={personalDetails.fullName} onChange={handlePersonalDetailsChange} /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={personalDetails.email} onChange={handlePersonalDetailsChange} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" value={personalDetails.phone} onChange={handlePersonalDetailsChange} /></div>
                  <div><Label htmlFor="address">Address (Optional)</Label><Input id="address" name="address" value={personalDetails.address} onChange={handlePersonalDetailsChange} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="linkedin">LinkedIn Profile URL</Label><Input id="linkedin" name="linkedin" value={personalDetails.linkedin} onChange={handlePersonalDetailsChange} /></div>
                  <div><Label htmlFor="github">GitHub Profile URL</Label><Input id="github" name="github" value={personalDetails.github} onChange={handlePersonalDetailsChange} /></div>
                </div>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                  <Input id="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} />
                  {profilePicturePreview && <Image src={profilePicturePreview} alt="Profile Preview" width={96} height={96} className="mt-2 h-24 w-24 rounded-md object-cover border" data-ai-hint="person avatar"/>}
                  <p className="text-xs text-muted-foreground mt-1">Image preview is local. Full cloud storage for images coming soon.</p>
                </div>
                 <div><Label htmlFor="summary">Professional Summary / Objective</Label><Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A brief overview of your skills and career goals..." /></div>
              </AccordionContent>
            </AccordionItem>

            {/* Education */}
            <AccordionItem value="education">
              <AccordionTrigger className="font-semibold text-lg"><GraduationCap className="mr-2 h-5 w-5 text-primary" />Education</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {educationEntries.map((edu, index) => (
                    <div key={edu.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setEducationEntries, edu.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                         <p className="text-xs font-medium text-muted-foreground">Education #{index + 1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor={`eduInstitution-${edu.id}`}>Institution Name</Label><Input id={`eduInstitution-${edu.id}`} value={edu.institution} onChange={e => updateEntry(setEducationEntries, edu.id, 'institution', e.target.value)} /></div>
                            <div><Label htmlFor={`eduDegree-${edu.id}`}>Degree/Course</Label><Input id={`eduDegree-${edu.id}`} value={edu.degree} onChange={e => updateEntry(setEducationEntries, edu.id, 'degree', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><Label htmlFor={`eduBranch-${edu.id}`}>Branch/Specialization</Label><Input id={`eduBranch-${edu.id}`} value={edu.branch} onChange={e => updateEntry(setEducationEntries, edu.id, 'branch', e.target.value)} /></div>
                            <div><Label htmlFor={`eduYear-${edu.id}`}>Year of Passing</Label><Input id={`eduYear-${edu.id}`} type="month" value={edu.year} onChange={e => updateEntry(setEducationEntries, edu.id, 'year', e.target.value)} /></div>
                            <div><Label htmlFor={`eduCgpa-${edu.id}`}>CGPA/Percentage</Label><Input id={`eduCgpa-${edu.id}`} value={edu.cgpa} onChange={e => updateEntry(setEducationEntries, edu.id, 'cgpa', e.target.value)} /></div>
                        </div>
                    </div>
                ))}
                 <Button variant="outline" size="sm" onClick={() => addEntry(setEducationEntries, { institution: '', degree: '', branch: '', year: '', cgpa: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Experience */}
            <AccordionItem value="experience">
                <AccordionTrigger className="font-semibold text-lg"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Internships/Experience</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {experienceEntries.map((exp, index) => (
                    <div key={exp.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setExperienceEntries, exp.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <p className="text-xs font-medium text-muted-foreground">Experience #{index + 1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor={`expCompany-${exp.id}`}>Company Name</Label><Input id={`expCompany-${exp.id}`} value={exp.company} onChange={e => updateEntry(setExperienceEntries, exp.id, 'company', e.target.value)} /></div>
                            <div><Label htmlFor={`expRole-${exp.id}`}>Role/Position</Label><Input id={`expRole-${exp.id}`} value={exp.role} onChange={e => updateEntry(setExperienceEntries, exp.id, 'role', e.target.value)} /></div>
                        </div>
                        <div><Label htmlFor={`expDuration-${exp.id}`}>Duration</Label><Input id={`expDuration-${exp.id}`} placeholder="e.g., May 2023 - Aug 2023" value={exp.duration} onChange={e => updateEntry(setExperienceEntries, exp.id, 'duration', e.target.value)} /></div>
                        <div><Label htmlFor={`expDescription-${exp.id}`}>Description (use bullet points)</Label><Textarea id={`expDescription-${exp.id}`} value={exp.description} onChange={e => updateEntry(setExperienceEntries, exp.id, 'description', e.target.value)} placeholder="- Did X, Y, Z using A, B, C" /></div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addEntry(setExperienceEntries, { company: '', role: '', duration: '', description: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Experience</Button>
                </AccordionContent>
            </AccordionItem>

             {/* Projects */}
             <AccordionItem value="projects">
                <AccordionTrigger className="font-semibold text-lg"><FolderKanban className="mr-2 h-5 w-5 text-primary"/>Projects</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {projectEntries.map((proj, index) => (
                    <div key={proj.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setProjectEntries, proj.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                         <p className="text-xs font-medium text-muted-foreground">Project #{index + 1}</p>
                        <div><Label htmlFor={`projTitle-${proj.id}`}>Project Title</Label><Input id={`projTitle-${proj.id}`} value={proj.title} onChange={e => updateEntry(setProjectEntries, proj.id, 'title', e.target.value)} /></div>
                        <div>
                            <Label htmlFor={`projTechStack-${proj.id}`}>Tech Stack (comma-separated)</Label>
                            <Input id={`projTechStack-${proj.id}`} value={proj.techStack.join(", ")} onChange={e => updateEntry(setProjectEntries, proj.id, 'techStack', e.target.value.split(',').map(s=>s.trim()))} />
                        </div>
                        <div><Label htmlFor={`projDescription-${proj.id}`}>Description</Label><Textarea id={`projDescription-${proj.id}`} value={proj.description} onChange={e => updateEntry(setProjectEntries, proj.id, 'description', e.target.value)} /></div>
                        <div><Label htmlFor={`projLink-${proj.id}`}>GitHub/Live Link</Label><Input id={`projLink-${proj.id}`} value={proj.link} onChange={e => updateEntry(setProjectEntries, proj.id, 'link', e.target.value)} /></div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addEntry(setProjectEntries, { title: '', techStack: [], description: '', link: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Project</Button>
                </AccordionContent>
            </AccordionItem>

            {/* Skills */}
             <AccordionItem value="skills">
                <AccordionTrigger className="font-semibold text-lg"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Skills</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                    <p className="text-xs text-muted-foreground">Group skills by category (e.g., Programming Languages, Frameworks, Tools, Soft Skills) when adding.</p>
                    <div className="flex items-center gap-2">
                        <Select onValueChange={(val) => {if(val) {setCurrentSkill(val); }}}>
                            <SelectTrigger><SelectValue placeholder="Select from common skills..."/></SelectTrigger>
                            <SelectContent>
                                {IT_KEYWORDS.slice(0,50).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Input placeholder="Or type skill manually" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} onKeyDown={e => {if(e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}/>
                        <Button onClick={handleAddSkill} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(s => <Badge key={s} variant="secondary">{s} <button onClick={() => handleRemoveSkill(s)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button></Badge>)}
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Certifications */}
            <AccordionItem value="certifications">
                <AccordionTrigger className="font-semibold text-lg"><Award className="mr-2 h-5 w-5 text-primary"/>Certifications</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {certificationEntries.map((cert, index) => (
                    <div key={cert.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setCertificationEntries, cert.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <p className="text-xs font-medium text-muted-foreground">Certification #{index + 1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor={`certName-${cert.id}`}>Course/Certification Name</Label><Input id={`certName-${cert.id}`} value={cert.name} onChange={e => updateEntry(setCertificationEntries, cert.id, 'name', e.target.value)} /></div>
                            <div><Label htmlFor={`certPlatform-${cert.id}`}>Platform/Issuing Body</Label><Input id={`certPlatform-${cert.id}`} value={cert.platform} onChange={e => updateEntry(setCertificationEntries, cert.id, 'platform', e.target.value)} /></div>
                        </div>
                        <div><Label htmlFor={`certDate-${cert.id}`}>Date Issued</Label><Input id={`certDate-${cert.id}`} type="month" value={cert.date} onChange={e => updateEntry(setCertificationEntries, cert.id, 'date', e.target.value)} /></div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addEntry(setCertificationEntries, { name: '', platform: '', date: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Certification</Button>
                </AccordionContent>
            </AccordionItem>

            {/* Languages */}
            <AccordionItem value="languages">
                <AccordionTrigger className="font-semibold text-lg"><Languages className="mr-2 h-5 w-5 text-primary"/>Languages</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {languageEntries.map((lang, index) => (
                    <div key={lang.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setLanguageEntries, lang.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <p className="text-xs font-medium text-muted-foreground">Language #{index + 1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor={`langName-${lang.id}`}>Language</Label><Input id={`langName-${lang.id}`} value={lang.name} onChange={e => updateEntry(setLanguageEntries, lang.id, 'name', e.target.value)} /></div>
                            <div>
                                <Label htmlFor={`langProficiency-${lang.id}`}>Proficiency</Label>
                                <Select value={lang.proficiency} onValueChange={val => updateEntry(setLanguageEntries, lang.id, 'proficiency', val as LanguageEntry['proficiency'])}>
                                    <SelectTrigger id={`langProficiency-${lang.id}`}><SelectValue placeholder="Select proficiency"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Basic">Basic</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                        <SelectItem value="Fluent">Fluent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addEntry(setLanguageEntries, { name: '', proficiency: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Language</Button>
                </AccordionContent>
            </AccordionItem>

            {/* Achievements */}
            <AccordionItem value="achievements">
                <AccordionTrigger className="font-semibold text-lg"><Award className="mr-2 h-5 w-5 text-primary"/>Awards & Achievements</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {achievementEntries.map((ach, index) => (
                     <div key={ach.id} className="p-3 border rounded-md space-y-3 relative bg-background/50">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeEntry(setAchievementEntries, ach.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        <p className="text-xs font-medium text-muted-foreground">Achievement #{index + 1}</p>
                        <div><Label htmlFor={`achDescription-${ach.id}`}>Describe your achievement</Label><Textarea id={`achDescription-${ach.id}`} value={ach.description} onChange={e => updateEntry(setAchievementEntries, ach.id, 'description', e.target.value)} /></div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addEntry(setAchievementEntries, { description: ''})}><PlusCircle className="mr-2 h-4 w-4"/>Add Achievement</Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-sections" disabled>
              <AccordionTrigger className="font-semibold text-lg"><PlusCircle className="mr-2 h-5 w-5 text-primary" />Custom Sections (Coming Soon)</AccordionTrigger>
              <AccordionContent className="p-4 border rounded-md bg-card">
                <p className="text-muted-foreground text-sm">Feature to add custom sections like Volunteering or Hobbies coming soon.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button onClick={handleSaveResume} variant="default" disabled={isSaving || !userId}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} 
                Save Resume to Cloud
            </Button>
            <Button onClick={handleExportPdf} variant="outline"><Printer className="mr-2 h-4 w-4" /> Export as PDF (Print)</Button>
            <Button variant="outline" size="sm" disabled><Palette className="mr-2 h-4 w-4"/>Templates (Coming Soon)</Button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <aside className="lg:col-span-2 space-y-6 print:col-span-5 print:space-y-2">
          <Card className="print:shadow-none print:border-none">
            <CardHeader className="print:hidden">
              <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-primary" />Live Resume Preview</CardTitle>
               <CardDescription>This is a basic preview. Use "Export as PDF" for a better view.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[calc(100vh-200px)] overflow-y-auto bg-muted/10 p-6 border rounded-md print:p-2 print:border-none print:bg-white print:text-black">
              {/* Personal Details Preview */}
              <div className="text-center mb-6 print:mb-3">
                {profilePicturePreview && (
                  <Image src={profilePicturePreview} alt="Profile" width={100} height={100} className="rounded-full mx-auto mb-2 h-24 w-24 object-cover print:h-20 print:w-20" data-ai-hint="person avatar"/>
                )}
                <h2 className="text-2xl font-bold print:text-xl">{personalDetails.fullName || "Your Name"}</h2>
                <p className="text-sm text-muted-foreground print:text-xs">
                  {personalDetails.email}{personalDetails.email && personalDetails.phone && " | "}{personalDetails.phone}
                  {personalDetails.address && ` | ${personalDetails.address}`}
                </p>
                <div className="flex justify-center gap-3 text-sm mt-1 print:text-xs">
                  {personalDetails.linkedin && <a href={personalDetails.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>}
                  {personalDetails.github && <a href={personalDetails.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>}
                </div>
              </div>

              {/* Summary Preview */}
              {summary && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Summary</h3>
                  <p className="text-sm whitespace-pre-line print:text-xs">{summary}</p>
                </section>
              )}

              {/* Education Preview */}
              {educationEntries.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Education</h3>
                  {educationEntries.map(edu => (
                    <div key={edu.id} className="mb-2 print:mb-1">
                      <h4 className="font-semibold print:text-sm">{edu.institution || "Institution"} - <span className="font-normal text-muted-foreground print:text-xs">{edu.degree || "Degree"}</span></h4>
                      <p className="text-sm text-muted-foreground print:text-xs">{edu.branch || "Branch"} | {edu.year ? new Date(edu.year + '-01T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' }) : "Year"} | CGPA/Percentage: {edu.cgpa || "N/A"}</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Experience Preview */}
              {experienceEntries.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Experience</h3>
                  {experienceEntries.map(exp => (
                    <div key={exp.id} className="mb-2 print:mb-1">
                      <h4 className="font-semibold print:text-sm">{exp.role || "Role"} at {exp.company || "Company"}</h4>
                      <p className="text-sm text-muted-foreground print:text-xs">{exp.duration || "Duration"}</p>
                      <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 print:text-xs print:pl-3">
                        {exp.description?.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* Projects Preview */}
              {projectEntries.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Projects</h3>
                  {projectEntries.map(proj => (
                    <div key={proj.id} className="mb-2 print:mb-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold print:text-sm">{proj.title || "Project Title"}</h4>
                        {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline print:hidden"><LinkIcon className="inline h-3 w-3 mr-1"/>Link</a>}
                      </div>
                      {proj.techStack.length > 0 && <p className="text-xs text-muted-foreground mb-0.5">Tech Stack: {proj.techStack.join(", ")}</p>}
                       <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 print:text-xs print:pl-3">
                        {proj.description?.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* Skills Preview */}
              {skills.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => <Badge key={skill} variant="secondary" className="print:text-xs print:px-1 print:py-0.5 print:border print:border-gray-300">{skill}</Badge>)}
                  </div>
                </section>
              )}
              
              {/* Certifications Preview */}
              {certificationEntries.length > 0 && (
                 <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Certifications</h3>
                  {certificationEntries.map(cert => (
                    <div key={cert.id} className="mb-1 print:mb-0.5">
                      <p className="text-sm print:text-xs"><span className="font-semibold">{cert.name || "Certification Name"}</span> from {cert.platform || "Platform"} ({cert.date ? new Date(cert.date + '-01T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' }) : "Date"})</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Languages Preview */}
              {languageEntries.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Languages</h3>
                  <p className="text-sm print:text-xs">
                    {languageEntries.map(lang => `${lang.name || "Language"} (${lang.proficiency || "Proficiency"})`).join(" | ")}
                  </p>
                </section>
              )}
              
              {/* Achievements Preview */}
              {achievementEntries.length > 0 && (
                <section className="mb-4 print:mb-2">
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2 print:text-base print:pb-0.5 print:mb-1">Achievements</h3>
                   <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 print:text-xs print:pl-3">
                        {achievementEntries.map(ach => ach.description?.split('\n').map((line, i) => line.trim() && <li key={`${ach.id}-${i}`}>{line.trim().replace(/^- /, '')}</li>))}
                  </ul>
                </section>
              )}

            </CardContent>
          </Card>
        </aside>
      </div>
       {/* Print-specific styles: Hidden on screen, visible for print */}
      <style jsx global>{`
        @media print {
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            font-size: 10pt; /* Example base font size for print */
          }
          .print\\:hidden { display: none !important; }
          .print\\:col-span-5 { grid-column: span 5 / span 5 !important; }
          .print\\:space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem !important; }
          .print\\:mb-3 { margin-bottom: 0.75rem !important; }
          .print\\:mb-2 { margin-bottom: 0.5rem !important; }
          .print\\:mb-1 { margin-bottom: 0.25rem !important; }
          .print\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .print\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .print\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .print\\:text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .print\\:p-2 { padding: 0.5rem !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:h-20 { height: 5rem !important; }
          .print\\:w-20 { width: 5rem !important; }
          .print\\:pb-0\\.5 { padding-bottom: 0.125rem !important; }
          .print\\:pl-3 { padding-left: 0.75rem !important; }
          .print\\:px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
          .print\\:py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .print\\:border { border-width: 1px !important; }
          .print\\:border-gray-300 { border-color: #D1D5DB !important; }
          a { text-decoration: none; color: inherit; }
        }
      `}</style>
    </div>
  );
}

