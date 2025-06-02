
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, UploadCloud, Trash2, Edit3, Award, ThumbsUp, Eye, Share2, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { identifySkills, SkillTaggingInput, SkillTaggingOutput } from '@/ai/flows/skill-tagging';
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  skills: string[];
  uploadedAt: Date;
}

const initialProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Website",
    description: "Developed a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented features like product catalog, shopping cart, user authentication, and payment gateway integration.",
    imageUrl: "https://placehold.co/600x400.png?text=E-commerce+Project",
    projectUrl: "https://example.com/ecommerce",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "HTML", "CSS"],
    uploadedAt: new Date(2023, 5, 15)
  },
  {
    id: "2",
    title: "Mobile Weather App",
    description: "Created a cross-platform mobile weather application using Flutter and OpenWeatherMap API. Features include real-time weather updates, 5-day forecast, and location-based services.",
    imageUrl: "https://placehold.co/600x400.png?text=Weather+App",
    projectUrl: "https://example.com/weather-app",
    skills: ["Flutter", "Dart", "API Integration", "Mobile Development", "UI/UX Design"],
    uploadedAt: new Date(2023, 8, 22)
  },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [projectDescriptionForTagging, setProjectDescriptionForTagging] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isTagging, setIsTagging] = useState(false);
  const { toast } = useToast();
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const baseCompletion = 20; 
    const projectBonus = Math.min(projects.length * 15, 60); 
    const skillsBonus = Math.min(projects.reduce((acc, p) => acc + p.skills.length, 0) * 2, 20); 
    setProfileCompletion(baseCompletion + projectBonus + skillsBonus);
  }, [projects]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
    if (name === 'description') {
      setProjectDescriptionForTagging(value);
    }
  };

  const handleProjectImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentProject(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSkillTagging = async () => {
    if (!projectDescriptionForTagging.trim()) {
      toast({ title: "Error", description: "Project description cannot be empty for skill tagging.", variant: "destructive" });
      return;
    }
    setIsTagging(true);
    try {
      const input: SkillTaggingInput = { description: projectDescriptionForTagging };
      const result: SkillTaggingOutput = await identifySkills(input);
      setSuggestedSkills(result.skills);
      setCurrentProject(prev => ({ ...prev, skills: [...(prev.skills || []), ...result.skills.filter(s => !(prev.skills || []).includes(s))] }));
      toast({ title: "Skills Suggested", description: "AI has suggested skills based on your description." });
    } catch (error) {
      console.error("Skill tagging failed:", error);
      toast({ title: "Skill Tagging Error", description: `Could not suggest skills. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
    } finally {
      setIsTagging(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !currentProject.skills?.includes(skill)) {
      setCurrentProject(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentProject(prev => ({ ...prev, skills: prev.skills?.filter(skill => skill !== skillToRemove) }));
  };

  const handleSubmitProject = () => {
    if (!currentProject.title || !currentProject.description) {
      toast({ title: "Error", description: "Project title and description are required.", variant: "destructive" });
      return;
    }
    const newProjectData: Project = {
      id: currentProject.id || Date.now().toString(),
      title: currentProject.title!,
      description: currentProject.description!,
      imageUrl: currentProject.imageUrl,
      projectUrl: currentProject.projectUrl,
      skills: currentProject.skills || [],
      uploadedAt: currentProject.id ? projects.find(p => p.id === currentProject.id)!.uploadedAt : new Date(),
    };

    if (currentProject.id) {
      setProjects(projects.map(p => p.id === newProjectData.id ? newProjectData : p));
      toast({ title: "Project Updated", description: `"${newProjectData.title}" has been updated.` });
    } else {
      setProjects([newProjectData, ...projects]);
      toast({ title: "Project Added", description: `"${newProjectData.title}" has been added to your portfolio.` });
    }
    setIsDialogOpen(false);
    setCurrentProject({});
    setProjectDescriptionForTagging("");
    setSuggestedSkills([]);
  };

  const openAddProjectDialog = () => {
    setCurrentProject({});
    setProjectDescriptionForTagging("");
    setSuggestedSkills([]);
    setIsDialogOpen(true);
  };
  
  const openEditProjectDialog = (project: Project) => {
    setCurrentProject(project);
    setProjectDescriptionForTagging(project.description);
    setSuggestedSkills([]);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast({ title: "Project Deleted", description: "The project has been removed from your portfolio." });
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-primary to-accent h-32 md:h-40 relative">
            <Image 
                src="https://placehold.co/1200x300.png?text=Profile+Banner" 
                alt="Profile Banner"
                layout="fill"
                objectFit="cover"
                data-ai-hint="abstract tech"
            />
        </div>
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16 sm:-mt-20 relative z-10">
            <div className="relative">
                <Image 
                    src="https://placehold.co/160x160.png?text=User" 
                    alt="User Avatar" 
                    width={160} 
                    height={160} 
                    className="rounded-full border-4 border-background shadow-md"
                    data-ai-hint="professional portrait"
                />
                <Button size="icon" variant="outline" className="absolute bottom-2 right-2 bg-background rounded-full h-8 w-8">
                    <Edit3 className="h-4 w-4"/>
                </Button>
            </div>
            <div className="text-center sm:text-left flex-grow">
                <h1 className="text-3xl font-bold font-headline">Your Name</h1>
                <p className="text-muted-foreground">Polytechnic Student | Aspiring Web Developer</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge variant="secondary">Bengaluru, Karnataka</Badge>
                    <Badge variant="secondary">Open to Internships</Badge>
                </div>
            </div>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share Profile</Button>
        </div>
        <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
             <div className="mt-4">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-primary">Profile Completion</span>
                    <span className="text-sm font-medium text-primary">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="w-full h-2" />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold font-headline">My Projects</h2>
        <Button onClick={openAddProjectDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center space-y-4">
            <Eye className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground font-body">Your portfolio is empty. Add your first project to showcase your skills!</p>
            <Button onClick={openAddProjectDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              {project.imageUrl && (
                <div className="aspect-video relative overflow-hidden">
                  <Image src={project.imageUrl} alt={project.title} layout="fill" objectFit="cover" data-ai-hint="project technology"/>
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline">{project.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Uploaded on {project.uploadedAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80 line-clamp-3 font-body">{project.description}</p>
                <div className="mt-3">
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0,5).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                    {project.skills.length > 5 && <Badge variant="outline" className="text-xs">+{project.skills.length - 5} more</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => { /* Implement like */ }} className="text-muted-foreground hover:text-primary">
                    <ThumbsUp className="h-4 w-4 mr-1" /> <span className="text-xs">Like</span>
                  </Button>
                  {project.projectUrl && (
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" /> <span className="text-xs">View</span>
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditProjectDialog(project)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{currentProject.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              Showcase your work by adding project details, images, and relevant skills.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" value={currentProject.title || ""} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={currentProject.description || ""} onChange={handleInputChange} className="col-span-3 min-h-[100px]" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectImageUpload" className="text-right">Image</Label>
              <div className="col-span-3">
                <Input id="projectImageUpload" name="projectImageUpload" type="file" accept="image/*" onChange={handleProjectImageFileChange} className="mb-2"/>
                {currentProject.imageUrl && <Image src={currentProject.imageUrl} alt="Project preview" width={100} height={100} className="rounded-md object-cover" data-ai-hint="project image"/>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectUrl" className="text-right">Project URL</Label>
              <Input id="projectUrl" name="projectUrl" value={currentProject.projectUrl || ""} onChange={handleInputChange} className="col-span-3" placeholder="https://github.com/your/project" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Skills</Label>
              <div className="col-span-3 space-y-2">
                <Button variant="outline" size="sm" onClick={handleSkillTagging} disabled={isTagging || !projectDescriptionForTagging.trim()}>
                  <Sparkles className="mr-2 h-4 w-4" /> {isTagging ? "Suggesting..." : "AI Suggest Skills"}
                </Button>
                {suggestedSkills.length > 0 && (
                  <div className="p-2 border rounded-md bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-1">Suggested by AI (click to add):</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedSkills.map(skill => (
                        <Badge key={skill} variant="outline" onClick={() => handleAddSkill(skill)} className="cursor-pointer hover:bg-primary hover:text-primary-foreground">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(currentProject.skills || []).map(skill => (
                    <Badge key={skill} variant="default">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="ml-1.5 opacity-70 hover:opacity-100">&times;</button>
                    </Badge>
                  ))}
                </div>
                 <div className="flex items-center gap-2">
                    <Input 
                        type="text" 
                        placeholder="Add skill manually" 
                        className="text-sm h-8"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                handleAddSkill(e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                 </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitProject}>Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    