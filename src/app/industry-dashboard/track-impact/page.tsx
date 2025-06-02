
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, TrendingUp, Users, FileText, BarChart2, Briefcase, Filter } from "lucide-react";
import { Label } from '@/components/ui/label';

// Dummy data for KPIs and charts
const kpiData = [
  { title: "Students Certified via Your Sessions", value: "120", change: "+15 last month", icon: <Users className="h-8 w-8 text-primary" /> },
  { title: "Resumes Analyzed (via your inputs)", value: "85", change: "+5 last month", icon: <FileText className="h-8 w-8 text-primary" /> }, // If industry contributes to resume analysis criteria
  { title: "Applications from Your Listings", value: "250", change: "+30 last month", icon: <Briefcase className="h-8 w-8 text-primary" /> },
  { title: "Engagement Score (Avg. Webinar Rating)", value: "4.6/5", change: "+0.2 last month", icon: <TrendingUp className="h-8 w-8 text-primary" /> },
];

export default function TrackImpactPage() {
  const [filterCertificationType, setFilterCertificationType] = useState("all");
  const [filterWebinar, setFilterWebinar] = useState("all");
  
  // In a real app, useEffect would fetch data based on filters

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <PieChart className="mr-3 h-8 w-8 text-primary" /> Track Certification Impact & Analytics
        </h1>
        {/* Optional: Date range picker or other global filters */}
      </div>

       {/* Top Section: Summary KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5 text-primary" /> Filter Analytics Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filterCertType">Certification Type / Domain</Label>
            <Select value={filterCertificationType} onValueChange={setFilterCertificationType}>
              <SelectTrigger id="filterCertType"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Certification Types</SelectItem>
                <SelectItem value="webdev">Web Development</SelectItem>
                <SelectItem value="datascience">Data Science</SelectItem>
                <SelectItem value="cloud">Cloud Computing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filterWebinarSession">Webinar/Mentorship Session</Label>
            <Select value={filterWebinar} onValueChange={setFilterWebinar}>
              <SelectTrigger id="filterWebinarSession"><SelectValue placeholder="All Sessions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="web1">Intro to Cloud with AWS (Dummy)</SelectItem>
                <SelectItem value="web2">Advanced React Patterns (Dummy)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Student Engagement via Your Activities</CardTitle>
            <CardDescription>Number of students participating in your webinars or applying to your jobs.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Chart for Student Engagement (e.g., Webinar Attendees Over Time, Applications per Job)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Skill Interest Trends</CardTitle>
            <CardDescription>Popularity of skills covered in your sessions or requested in job posts.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Heatmap or Bar Chart for Skill Interest (e.g., Top 5 skills students engaged with)
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary"/>Performance by Institution/Domain</CardTitle>
            <CardDescription>Comparative analytics on student engagement or skill acquisition from different polytechnics or domains based on your activities.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Chart for Top Performing Institutions/Domains (e.g., Most applications from X polytechnic for Y domain jobs)
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback & Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will provide insights from student feedback on your webinars and overall interaction quality.
            Data on application-to-hire ratios from your job postings will also be displayed here to help refine your outreach.
            (Analytics data is currently illustrative.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
