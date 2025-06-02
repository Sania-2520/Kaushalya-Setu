
"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileSignature, User, GraduationCap, Briefcase, FolderKanban, ListChecks, Languages, Award, PlusCircle, Save, Eye, Printer, Palette } from "lucide-react";
import { IT_KEYWORDS } from '@/lib/constants'; // For skills suggestions
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for repeatable sections
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


export default function ResumeBuilderPage() {
  const { toast } = useToast();

  // Personal Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  // For simplicity, single entries for now. Extend to arrays for multiple entries.
  const [education, setEducation] = useState<Partial<EducationEntry>>({});
  const [experience, setExperience] = useState<Partial<ExperienceEntry>>({});
  const [project, setProject] = useState<Partial<ProjectEntry>>({ techStack: [] });
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [certification, setCertification] = useState<Partial<CertificationEntry>>({});
  const [language, setLanguage] = useState<Partial<LanguageEntry>>({ proficiency: '' });
  const [achievement, setAchievement] = useState<Partial<AchievementEntry>>({});
  
  // Placeholder for custom sections
  const [customSections, setCustomSections] = useState<{ title: string; content: string }[]>([]);

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
  
  const handleSaveDraft = () => {
    toast({ title: "Draft Saved (Simulated)", description: "Your resume draft has been saved locally." });
  };

  const handleExportPdf = () => {
    toast({ title: "Exporting PDF (Simulated)", description: "Resume PDF generation would start here." });
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileSignature className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Resume Builder</CardTitle>
              <CardDescription className="mt-1 text-sm md:text-base">
                Create a professional resume from scratch. Fill out the sections below, preview, and export your resume.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          <Accordion type="multiple" defaultValue={['personal-details']} className="w-full">
            {/* Personal Details */}
            <AccordionItem value="personal-details">
              <AccordionTrigger className="font-semibold text-lg"><User className="mr-2 h-5 w-5 text-primary" />Personal Details</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                  <div><Label htmlFor="address">Address (Optional)</Label><Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="linkedin">LinkedIn Profile URL</Label><Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} /></div>
                  <div><Label htmlFor="github">GitHub Profile URL</Label><Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} /></div>
                </div>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                  <Input id="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} />
                  {profilePicturePreview && <img src={profilePicturePreview} alt="Profile Preview" className="mt-2 h-24 w-24 rounded-md object-cover border" data-ai-hint="person avatar" />}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Education */}
            <AccordionItem value="education">
              <AccordionTrigger className="font-semibold text-lg"><GraduationCap className="mr-2 h-5 w-5 text-primary" />Education</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                {/* Single entry for now */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="eduInstitution">Institution Name</Label><Input id="eduInstitution" value={education.institution || ""} onChange={e => setEducation(p => ({...p, institution: e.target.value}))} /></div>
                  <div><Label htmlFor="eduDegree">Degree/Course</Label><Input id="eduDegree" value={education.degree || ""} onChange={e => setEducation(p => ({...p, degree: e.target.value}))} /></div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label htmlFor="eduBranch">Branch/Specialization</Label><Input id="eduBranch" value={education.branch || ""} onChange={e => setEducation(p => ({...p, branch: e.target.value}))} /></div>
                    <div><Label htmlFor="eduYear">Year of Passing</Label><Input id="eduYear" type="month" value={education.year || ""} onChange={e => setEducation(p => ({...p, year: e.target.value}))} /></div>
                    <div><Label htmlFor="eduCgpa">CGPA/Percentage</Label><Input id="eduCgpa" value={education.cgpa || ""} onChange={e => setEducation(p => ({...p, cgpa: e.target.value}))} /></div>
                 </div>
                 <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Education (Coming Soon)</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Experience */}
            <AccordionItem value="experience">
                <AccordionTrigger className="font-semibold text-lg"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Internships/Experience</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="expCompany">Company Name</Label><Input id="expCompany" value={experience.company || ""} onChange={e => setExperience(p => ({...p, company: e.target.value}))} /></div>
                        <div><Label htmlFor="expRole">Role/Position</Label><Input id="expRole" value={experience.role || ""} onChange={e => setExperience(p => ({...p, role: e.target.value}))} /></div>
                    </div>
                    <div><Label htmlFor="expDuration">Duration</Label><Input id="expDuration" placeholder="e.g., May 2023 - Aug 2023" value={experience.duration || ""} onChange={e => setExperience(p => ({...p, duration: e.target.value}))} /></div>
                    <div><Label htmlFor="expDescription">Description (use bullet points)</Label><Textarea id="expDescription" value={experience.description || ""} onChange={e => setExperience(p => ({...p, description: e.target.value}))} placeholder="- Did X, Y, Z using A, B, C" /></div>
                    <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Experience (Coming Soon)</Button>
                </AccordionContent>
            </AccordionItem>

            {/* Projects */}
             <AccordionItem value="projects">
                <AccordionTrigger className="font-semibold text-lg"><FolderKanban className="mr-2 h-5 w-5 text-primary"/>Projects</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                    <div><Label htmlFor="projTitle">Project Title</Label><Input id="projTitle" value={project.title || ""} onChange={e => setProject(p => ({...p, title: e.target.value}))} /></div>
                    <div>
                        <Label htmlFor="projTechStack">Tech Stack (comma-separated)</Label>
                        <Input id="projTechStack" value={(project.techStack || []).join(", ")} onChange={e => setProject(p => ({...p, techStack: e.target.value.split(',').map(s=>s.trim())}))} />
                    </div>
                    <div><Label htmlFor="projDescription">Description</Label><Textarea id="projDescription" value={project.description || ""} onChange={e => setProject(p => ({...p, description: e.target.value}))} /></div>
                    <div><Label htmlFor="projLink">GitHub/Live Link</Label><Input id="projLink" value={project.link || ""} onChange={e => setProject(p => ({...p, link: e.target.value}))} /></div>
                    <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Project (Coming Soon)</Button>
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
                        <Input placeholder="Or type skill manually" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} onKeyDown={e => {if(e.key === 'Enter') handleAddSkill()}}/>
                        <Button onClick={handleAddSkill} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(s => <Badge key={s} variant="secondary">{s} <button onClick={() => handleRemoveSkill(s)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button></Badge>)}
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Certifications, Languages, Achievements - similar structure */}
            <AccordionItem value="certifications">
                <AccordionTrigger className="font-semibold text-lg"><Award className="mr-2 h-5 w-5 text-primary"/>Certifications</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="certName">Course/Certification Name</Label><Input id="certName" value={certification.name || ""} onChange={e => setCertification(c => ({...c, name: e.target.value}))} /></div>
                        <div><Label htmlFor="certPlatform">Platform/Issuing Body</Label><Input id="certPlatform" value={certification.platform || ""} onChange={e => setCertification(c => ({...c, platform: e.target.value}))} /></div>
                    </div>
                    <div><Label htmlFor="certDate">Date Issued</Label><Input id="certDate" type="month" value={certification.date || ""} onChange={e => setCertification(c => ({...c, date: e.target.value}))} /></div>
                     <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Certification (Coming Soon)</Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="languages">
                <AccordionTrigger className="font-semibold text-lg"><Languages className="mr-2 h-5 w-5 text-primary"/>Languages</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="langName">Language</Label><Input id="langName" value={language.name || ""} onChange={e => setLanguage(l => ({...l, name: e.target.value}))} /></div>
                        <div>
                            <Label htmlFor="langProficiency">Proficiency</Label>
                            <Select value={language.proficiency} onValueChange={val => setLanguage(l => ({...l, proficiency: val as LanguageEntry['proficiency']}))}>
                                <SelectTrigger id="langProficiency"><SelectValue placeholder="Select proficiency"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Fluent">Fluent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Language (Coming Soon)</Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="achievements">
                <AccordionTrigger className="font-semibold text-lg"><Award className="mr-2 h-5 w-5 text-primary"/>Awards & Achievements</AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 border rounded-md bg-card">
                    <div><Label htmlFor="achDescription">Describe your achievement</Label><Textarea id="achDescription" value={achievement.description || ""} onChange={e => setAchievement(a => ({...a, description: e.target.value}))} /></div>
                     <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Add Another Achievement (Coming Soon)</Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-sections">
              <AccordionTrigger className="font-semibold text-lg"><PlusCircle className="mr-2 h-5 w-5 text-primary" />Custom Sections (e.g., Volunteering)</AccordionTrigger>
              <AccordionContent className="p-4 border rounded-md bg-card">
                <p className="text-muted-foreground text-sm">Feature to add custom sections coming soon.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button onClick={handleSaveDraft} variant="outline"><Save className="mr-2 h-4 w-4" /> Save as Draft (Simulated)</Button>
            <Button variant="secondary" disabled><Eye className="mr-2 h-4 w-4" /> Live Preview (Coming Soon)</Button>
            <Button onClick={handleExportPdf}><Printer className="mr-2 h-4 w-4" /> Export as PDF (Simulated)</Button>
          </div>
        </div>

        {/* Resume Preview & Templates (Placeholder) */}
        <aside className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-primary" />Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="h-96 bg-muted/50 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground italic">PDF-like preview will appear here.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Resume Templates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 text-sm">Choose a template:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Basic</Button>
                <Button variant="outline" size="sm" disabled>Creative</Button>
                <Button variant="outline" size="sm" disabled>ATS-Friendly</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
