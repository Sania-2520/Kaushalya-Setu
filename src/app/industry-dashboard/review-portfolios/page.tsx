
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Filter, Star, Download, MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IT_KEYWORDS, INDIAN_CITIES, ALL_FILTER_VALUE } from '@/lib/constants'; // Assuming polytechnic names might be like cities or a new constant
import { cn } from '@/lib/utils';

interface StudentPortfolio {
  id: string;
  name: string;
  avatarUrl?: string;
  polytechnic: string;
  skills: string[];
  certifications: string[]; // Names of certifications
  portfolioSummary: string; // Short bio or summary
  resumeUrl?: string; // Link to download/view resume
  isShortlisted?: boolean;
}

// Dummy data
const dummyPortfolios: StudentPortfolio[] = [
  { id: 'stud1', name: 'Aarav Sharma', avatarUrl: 'https://placehold.co/80x80.png?text=AS', polytechnic: 'Govt. Polytechnic Bengaluru', skills: ['React', 'Node.js', 'MongoDB'], certifications: ['AWS Cloud Practitioner', 'React Basics'], portfolioSummary: 'Aspiring full-stack developer with a passion for building scalable web applications. Strong problem-solving skills demonstrated through various projects.', resumeUrl: '#', isShortlisted: false },
  { id: 'stud2', name: 'Priya Patel', avatarUrl: 'https://placehold.co/80x80.png?text=PP', polytechnic: 'SJP Polytechnic', skills: ['Python', 'Data Analysis', 'SQL', 'Machine Learning'], certifications: ['Python for Data Science', 'SQL Fundamentals'], portfolioSummary: 'Data enthusiast eager to apply analytical skills to solve real-world problems. Proficient in data visualization and statistical modeling.', resumeUrl: '#', isShortlisted: true },
  { id: 'stud3', name: 'Rohan Das', polytechnic: 'MEI Polytechnic', skills: ['Java', 'Spring Boot', 'Microservices'], certifications: ['Java SE Programmer'], portfolioSummary: 'Backend developer focused on creating robust and efficient systems. Experience with API development and cloud platforms.', resumeUrl: '#', isShortlisted: false },
  { id: 'stud4', name: 'Sneha Reddy', avatarUrl: 'https://placehold.co/80x80.png?text=SR', polytechnic: 'Acharya Polytechnic', skills: ['JavaScript', 'HTML', 'CSS', 'Figma', 'UI/UX'], certifications: ['UI/UX Design Specialization'], portfolioSummary: 'Creative UI/UX designer with a keen eye for detail and user-centered design principles. Excited to create intuitive digital experiences.', resumeUrl: '#', isShortlisted: false },
];

const DUMMY_POLYTECHNICS = ["Govt. Polytechnic Bengaluru", "SJP Polytechnic", "MEI Polytechnic", "Acharya Polytechnic", "All Polytechnics"];
const DUMMY_CERTIFICATIONS = ["AWS Cloud Practitioner", "React Basics", "Python for Data Science", "SQL Fundamentals", "Java SE Programmer", "UI/UX Design Specialization", "All Certifications"];


export default function ReviewPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<StudentPortfolio[]>(dummyPortfolios);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState(ALL_FILTER_VALUE);
  const [filterPolytechnic, setFilterPolytechnic] = useState(ALL_FILTER_VALUE);
  const [filterCertification, setFilterCertification] = useState(ALL_FILTER_VALUE);
  const [filterSkill, setFilterSkill] = useState(ALL_FILTER_VALUE);

  const { toast } = useToast();

  const handleShortlistToggle = (studentId: string) => {
    setPortfolios(prev =>
      prev.map(p =>
        p.id === studentId ? { ...p, isShortlisted: !p.isShortlisted } : p
      )
    );
    const student = portfolios.find(p => p.id === studentId);
    toast({ title: student?.isShortlisted ? "Removed from Shortlist" : "Added to Shortlist", description: `${student?.name} has been ${student?.isShortlisted ? 'removed from' : 'added to'} your shortlist.` });
  };
  
  const handleSendMessage = (studentName: string) => {
     toast({title: "Feature Coming Soon", description: `Messaging functionality for ${studentName} will be available soon.`});
  };
  
  const handleLeaveEndorsement = (studentName: string) => {
    toast({title: "Feature Coming Soon", description: `Endorsement feature for ${studentName} will be available soon.`});
  };

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(p => {
      const matchesSearch = searchTerm === "" || 
                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDomain = filterDomain === ALL_FILTER_VALUE || p.skills.some(s => s.toLowerCase().includes(filterDomain.toLowerCase())); // Simplified domain check on skills
      const matchesPolytechnic = filterPolytechnic === ALL_FILTER_VALUE || p.polytechnic === filterPolytechnic;
      const matchesCertification = filterCertification === ALL_FILTER_VALUE || p.certifications.includes(filterCertification);
      const matchesSkill = filterSkill === ALL_FILTER_VALUE || p.skills.includes(filterSkill);
      
      return matchesSearch && matchesDomain && matchesPolytechnic && matchesCertification && matchesSkill;
    });
  }, [portfolios, searchTerm, filterDomain, filterPolytechnic, filterCertification, filterSkill]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Search className="mr-3 h-8 w-8 text-primary" /> Review Student Portfolios
        </h1>
        {/* Optional: Button for "View Shortlisted" or advanced search */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5 text-primary" /> Filter & Search Students</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input 
            placeholder="Search by name or skill..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="sm:col-span-2 lg:col-span-1"
          />
          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger><SelectValue placeholder="Filter by Domain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All Domains</SelectItem>
              {/* Populate with actual domains later */}
              {IT_KEYWORDS.filter(k => k.length > 5).slice(0,5).map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={filterPolytechnic} onValueChange={setFilterPolytechnic}>
            <SelectTrigger><SelectValue placeholder="Filter by Polytechnic" /></SelectTrigger>
            <SelectContent>
              {DUMMY_POLYTECHNICS.map(item => <SelectItem key={item} value={item === "All Polytechnics" ? ALL_FILTER_VALUE : item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCertification} onValueChange={setFilterCertification}>
            <SelectTrigger><SelectValue placeholder="Filter by Certification" /></SelectTrigger>
            <SelectContent>
                {DUMMY_CERTIFICATIONS.map(item => <SelectItem key={item} value={item === "All Certifications" ? ALL_FILTER_VALUE : item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={filterSkill} onValueChange={setFilterSkill}>
            <SelectTrigger><SelectValue placeholder="Filter by Specific Skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>All Skills</SelectItem>
              {IT_KEYWORDS.slice(0,15).map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">Student Profiles ({filteredPortfolios.length})</h2>
        {filteredPortfolios.length === 0 ? (
            <Card className="text-center py-12">
                <CardContent className="flex flex-col items-center space-y-4">
                <Users className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground font-body">No student profiles match your current filters. Try broadening your search!</p>
                </CardContent>
            </Card>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((student) => (
            <Card key={student.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar"/>
                  <AvatarFallback>{student.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold font-headline leading-tight">{student.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{student.polytechnic}</p>
                </div>
                 <Button variant={student.isShortlisted ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => handleShortlistToggle(student.id)}>
                    <Star className={cn("h-4 w-4", student.isShortlisted && "fill-current")}/>
                    <span className="sr-only">{student.isShortlisted ? "Remove from shortlist" : "Add to shortlist"}</span>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-foreground/80 line-clamp-3 mb-3 font-body">{student.portfolioSummary}</p>
                <div className="mb-2">
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Top Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 4).map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                    {student.skills.length > 4 && <Badge variant="outline" className="text-xs">+{student.skills.length - 4} more</Badge>}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Certifications:</h4>
                   <div className="flex flex-wrap gap-1">
                    {student.certifications.slice(0, 2).map(cert => <Badge key={cert} variant="outline" className="text-xs border-primary/50 text-primary/80">{cert}</Badge>)}
                    {student.certifications.length > 2 && <Badge variant="outline" className="text-xs">+{student.certifications.length - 2} more</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t flex flex-col sm:flex-row sm:justify-between gap-2">
                 <Button size="sm" variant="ghost" className="text-xs w-full sm:w-auto justify-start" onClick={() => alert('View full portfolio of ' + student.name)}>
                    <Eye className="mr-1.5 h-3.5 w-3.5"/> View Full Portfolio
                 </Button>
                 <div className="flex gap-1 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-initial" onClick={() => handleSendMessage(student.name)}>
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5"/> Message
                    </Button>
                    {student.resumeUrl && (
                        <Button size="sm" variant="outline" asChild className="text-xs flex-1 sm:flex-initial">
                            <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-1.5 h-3.5 w-3.5"/> Resume
                            </a>
                        </Button>
                    )}
                 </div>
              </CardFooter>
               <div className="p-2 px-4 border-t bg-muted/30">
                    <Button size="sm" variant="link" className="text-xs p-0 h-auto text-primary" onClick={() => handleLeaveEndorsement(student.name)}>
                        <ThumbsUp className="mr-1.5 h-3.5 w-3.5"/> Leave Endorsement / Badge (Coming Soon)
                    </Button>
               </div>
            </Card>
          ))}
        </div>
        )}
      </section>
    </div>
  );
}

