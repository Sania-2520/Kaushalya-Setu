
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users, BarChart3, Settings, Download, Eye, BookOpen, Briefcase, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudentAnalytic {
  id: string;
  name: string;
  skills: string[];
  placementStatus: string;
  progress: number; // 0-100
}

const dummyStudentAnalytics: StudentAnalytic[] = [
  { id: "1", name: "Aarav Sharma", skills: ["React", "Node.js", "MongoDB"], placementStatus: "Placed at Tech Solutions Inc.", progress: 90 },
  { id: "2", name: "Priya Patel", skills: ["Python", "Data Analysis", "SQL"], placementStatus: "Internship at Data Insights Co.", progress: 75 },
  { id: "3", name: "Rohan Das", skills: ["Java", "Spring Boot", "AWS"], placementStatus: "Actively Applying", progress: 60 },
  { id: "4", name: "Sneha Reddy", skills: ["JavaScript", "HTML", "CSS", "UI/UX Basics"], placementStatus: "Seeking Internship", progress: 80 },
  { id: "5", name: "Vikram Singh", skills: ["Cybersecurity", "Networking", "Python"], placementStatus: "Placed at SecureNet Ltd.", progress: 95 },
  { id: "6", name: "Ananya Gupta", skills: ["Flutter", "Dart", "Firebase"], placementStatus: "Building Portfolio Projects", progress: 70 },
  { id: "7", name: "Mohammed Khan", skills: ["Machine Learning", "TensorFlow", "Python"], placementStatus: "Internship at AI Innovations", progress: 85 },
  { id: "8", name: "Deepika Iyer", skills: ["C#", ".NET", "Azure"], placementStatus: "Actively Applying", progress: 55 },
  { id: "9", name: "Arjun Mehta", skills: ["React Native", "JavaScript"], placementStatus: "Seeking Entry-Level Role", progress: 65 },
  { id: "10", name: "Meera Krishnan", skills: ["Data Science", "R", "Statistics"], placementStatus: "Placed at Quant Analytics", progress: 88 },
  { id: "11", name: "Siddharth Joshi", skills: ["Angular", "TypeScript", "RxJS"], placementStatus: "Internship at Web Frameworks LLC", progress: 72 },
  { id: "12", name: "Neha Rao", skills: ["Cloud Computing", "GCP", "Kubernetes"], placementStatus: "Building Cloud Certification", progress: 78 },
];


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);

  const handleDownloadProgress = () => {
    toast({
      title: "Progress Report Initiated",
      description: "Student progress report (CSV/Excel format) is being generated and will be available for download.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
          Polytechnic Admin Dashboard
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is your central hub for managing Kaushalya Setu platform activities related to your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body">
            From here, you can (eventually) manage student accounts, view institutional analytics, oversee industry partnerships, and configure platform settings specific to your polytechnic.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl font-semibold font-headline">Manage Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-body mb-4">
              View student profiles, track progress, manage enrollments, and download student progress reports.
            </p>
            <Button onClick={handleDownloadProgress} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download Progress Report
            </Button>
          </CardContent>
        </Card>
        
        <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl font-semibold font-headline">Institutional Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Access reports on student engagement, skill development, and placement success. Click to view detailed student analytics.
              </p>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> View Student Analytics
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Student Analytics Overview</DialogTitle>
              <DialogDescription>
                Detailed breakdown of student skills, placement status, and progress.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold">Skills Learning</TableHead>
                    <TableHead className="font-semibold">Placement Status</TableHead>
                    <TableHead className="w-[150px] font-semibold">Overall Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyStudentAnalytics.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>{student.placementStatus}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground">{student.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {/* Optional: DialogFooter if needed for actions */}
          </DialogContent>
        </Dialog>

        <FeatureCard
          icon={<Settings className="h-8 w-8 text-primary" />}
          title="Platform Settings"
          description="Configure institution-specific settings and integrations."
        />
      </div>
       <Card className="mt-8">
        <CardHeader>
            <CardTitle>Placeholder Content</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground font-body">
                This page is a placeholder for the Polytechnic Admin Dashboard. 
                More specific functionalities and data visualizations will be added here in future iterations.
            </p>
        </CardContent>
       </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-xl font-semibold font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );
}
