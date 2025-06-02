
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, ArrowLeft, Users, Activity, Award, Briefcase, TrendingUp, TrendingDown, Filter, Download, Calendar, Users2, BarChart2, PieChart, Star, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const kpiData = [
  { title: "Total Students Enrolled", value: "1,250", change: "+50 last month", trend: <TrendingUp className="h-5 w-5 text-green-500" />, icon: <Users2 className="h-8 w-8 text-primary" /> },
  { title: "Avg. Engagement Rate", value: "78%", change: "+3% last 30 days", trend: <TrendingUp className="h-5 w-5 text-green-500" />, icon: <Activity className="h-8 w-8 text-primary" /> },
  { title: "Certifications Earned", value: "850", change: "+120 this semester", trend: <TrendingUp className="h-5 w-5 text-green-500" />, icon: <Award className="h-8 w-8 text-primary" /> },
  { title: "Placement Success Rate", value: "65%", change: "-2% vs last year", trend: <TrendingDown className="h-5 w-5 text-red-500" />, icon: <Briefcase className="h-8 w-8 text-primary" /> },
];

const dummyStudentsForReport = [
    {id: '1', name: 'Aarav Sharma', email: 'aarav@example.com', course: 'Computer Science', certifications: 5, portfolioScore: 85, placementStatus: 'Placed', lastActive: '2 days ago'},
    {id: '2', name: 'Priya Patel', email: 'priya@example.com', course: 'Electronics', certifications: 3, portfolioScore: 70, placementStatus: 'Internship', lastActive: '1 day ago'},
    {id: '3', name: 'Rohan Das', email: 'rohan@example.com', course: 'Mechanical', certifications: 1, portfolioScore: 60, placementStatus: 'Seeking', lastActive: '5 days ago'},
];

export default function InstitutionalAnalyticsAdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Institutional Analytics
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
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
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {kpi.trend}
                <span>{kpi.change}</span>
              </div>
              {/* Placeholder for sparkline/hover insights */}
              <div className="h-8 mt-2 bg-muted/50 rounded-sm flex items-center justify-center text-xs text-muted-foreground">
                Trendline/Insight Placeholder
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Section 1: Engagement & Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Engagement & Usage Trends</CardTitle>
          <CardDescription>Track student activity and platform interaction patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <Label htmlFor="timeRange">Time Range</Label>
                <Select defaultValue="30days">
                    <SelectTrigger id="timeRange"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="semester1">Semester 1</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="courseFilterAnalytics">Course/Department</Label>
                <Select defaultValue="all">
                    <SelectTrigger id="courseFilterAnalytics"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                         <SelectItem value="mechanical">Mechanical</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="semesterFilterAnalytics">Semester</Label>
                <Select defaultValue="all">
                    <SelectTrigger id="semesterFilterAnalytics"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="5">Semester 5</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
              Placeholder: Daily/Weekly/Monthly Student Logins Chart
            </div>
            <div className="h-64 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
              Placeholder: Most Active Times of Day Chart
            </div>
            <div className="h-64 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
              Placeholder: Page-wise Usage Distribution Chart
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Skill Development & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Award className="mr-2 h-5 w-5 text-primary"/>Skill Development & Certifications</CardTitle>
          <CardDescription>Analyze skill acquisition and certification achievements.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Skill Domains with Most Certifications (Bar Chart)
          </div>
          <div className="h-72 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Students per Skill Track (Tree Map/Donut Chart)
          </div>
          <div className="md:col-span-2 h-72 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Certification Completion Funnel (Registered → In Progress → Completed → Verified)
          </div>
           <div className="md:col-span-2 h-48 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Heatmaps for Course-wise Certification Density
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Webinar Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Webinar Analytics</CardTitle>
           <CardDescription>Insights into webinar engagement and effectiveness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-48 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
                    Placeholder: Total Webinars Hosted & Attendance Rates Chart
                </div>
                <div className="h-48 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
                    Placeholder: Ratings & Feedback Distribution Chart
                </div>
                 <div className="h-48 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
                    Placeholder: Webinar Attendance vs Portfolio Improvement (Correlation)
                </div>
            </div>
             <div className="text-muted-foreground italic p-4 text-center">Placeholder: Table of Top-Rated Webinars</div>
        </CardContent>
      </Card>

      {/* Section 4: Placement Success & Portfolio Strength */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Placement Success & Portfolio Strength</CardTitle>
          <CardDescription>Evaluate student readiness for the job market.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-60 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: % of Final-Year Students with Strong Portfolios (Donut Chart)
          </div>
          <div className="h-60 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Resume Analyzer Average Scores by Department (Bar Chart)
          </div>
          <div className="h-60 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Placement Rate (Offers vs Applicants) Chart
          </div>
          <div className="h-60 bg-muted/50 rounded-lg p-4 flex items-center justify-center text-muted-foreground italic">
            Placeholder: Companies Interacted (Logo Cloud or List)
          </div>
          <div className="md:col-span-2 text-muted-foreground italic p-4 text-center border-t mt-4">
            Placeholder: "Top Performing Students" Section with Export Option <Button size="sm" variant="outline" className="ml-2"><Download className="mr-1 h-3 w-3"/>Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Filterable Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileSpreadsheet className="mr-2 h-5 w-5 text-primary"/>Filterable Reports</CardTitle>
          <CardDescription>Generate and download detailed student reports.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[150px]">
                    <Label htmlFor="reportDepartment">Department</Label>
                     <Select defaultValue="all">
                        <SelectTrigger id="reportDepartment"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="cs">Computer Science</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <Label htmlFor="reportCertification">Certification Track</Label>
                     <Select defaultValue="all">
                        <SelectTrigger id="reportCertification"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tracks</SelectItem>
                            <SelectItem value="webdev">Web Development</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <Label htmlFor="reportPortfolioScore">Portfolio Score Range</Label>
                     <Select defaultValue="all">
                        <SelectTrigger id="reportPortfolioScore"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Scores</SelectItem>
                            <SelectItem value="gt80">&gt; 80</SelectItem>
                            <SelectItem value="60-80">60-80</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button className="self-end">
                    <Download className="mr-2 h-4 w-4" /> Generate & Download Report (CSV/PDF)
                </Button>
            </div>
            <div className="overflow-x-auto">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Certifications</TableHead>
                            <TableHead>Portfolio Score</TableHead>
                            <TableHead>Placement Status</TableHead>
                            <TableHead>Last Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyStudentsForReport.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.course}</TableCell>
                                <TableCell className="text-center">{student.certifications}</TableCell>
                                <TableCell className="text-center">{student.portfolioScore}</TableCell>
                                <TableCell><Badge variant={student.placementStatus === 'Placed' ? 'default' : student.placementStatus === 'Internship' ? 'secondary' : 'outline' }>{student.placementStatus}</Badge></TableCell>
                                <TableCell>{student.lastActive}</TableCell>
                            </TableRow>
                        ))}
                         {dummyStudentsForReport.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No data available for selected filters.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
                This is a simplified table. Actual implementation will dynamically load data based on filters and support pagination.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

