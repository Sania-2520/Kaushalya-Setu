
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, ArrowLeft, Users, Activity, Award, Briefcase, TrendingUp, TrendingDown, Filter, Download, Calendar, Users2, BarChart2, PieChart as ShadCNPieIcon, Star, FileSpreadsheet, Video, Percent, ThumbsUp, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


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

const topPerformingStudentsData = [
    {id: 'tp1', name: 'Riya Sharma', course: 'Computer Science', portfolioScore: 92, placementStatus: 'Placed at TechCorp', skills: ['React', 'Node.js'], avgRating: 4.8},
    {id: 'tp2', name: 'Karan Verma', course: 'Data Science', portfolioScore: 88, placementStatus: 'Internship at DataSolutions', skills: ['Python', 'ML'], avgRating: 4.5},
    {id: 'tp3', name: 'Anjali Singh', course: 'Cloud Computing', portfolioScore: 90, placementStatus: 'Placed at CloudNet', skills: ['AWS', 'DevOps'], avgRating: 4.7},
];

const weeklyLoginsData = [
  { name: 'Mon', logins: 120, fill: "hsl(var(--chart-1))" },
  { name: 'Tue', logins: 180, fill: "hsl(var(--chart-1))" },
  { name: 'Wed', logins: 150, fill: "hsl(var(--chart-1))" },
  { name: 'Thu', logins: 210, fill: "hsl(var(--chart-1))" },
  { name: 'Fri', logins: 250, fill: "hsl(var(--chart-1))" },
  { name: 'Sat', logins: 90, fill: "hsl(var(--chart-1))" },
  { name: 'Sun', logins: 70, fill: "hsl(var(--chart-1))" },
];

const activeTimesData = [
  { time: 'Morning (6-12)', users: 150, fill: "hsl(var(--chart-2))" },
  { time: 'Afternoon (12-6)', users: 280, fill: "hsl(var(--chart-2))" },
  { time: 'Evening (6-12)', users: 220, fill: "hsl(var(--chart-2))" },
  { time: 'Night (12-6)', users: 80, fill: "hsl(var(--chart-2))" },
];

const pageUsageData = [
  { page: 'Portfolio', views: 750, fill: "hsl(var(--chart-3))" },
  { page: 'Jobs', views: 620, fill: "hsl(var(--chart-3))" },
  { page: 'Webinars', views: 480, fill: "hsl(var(--chart-3))" },
  { page: 'Certificates', views: 350, fill: "hsl(var(--chart-3))" },
  { page: 'Resume Tool', views: 290, fill: "hsl(var(--chart-3))" },
];

const skillDomainsCertificationsData = [
  { name: "Web Dev", certifications: 180, fill: "hsl(var(--chart-1))" },
  { name: "Data Sci", certifications: 150, fill: "hsl(var(--chart-2))" },
  { name: "Cloud", certifications: 120, fill: "hsl(var(--chart-3))" },
  { name: "CyberSec", certifications: 90, fill: "hsl(var(--chart-4))" },
  { name: "AI/ML", certifications: 75, fill: "hsl(var(--chart-5))" },
];

const studentsPerSkillTrackData = [
  { name: "Full Stack Dev", value: 250, fill: "hsl(var(--chart-1))" },
  { name: "Data Analytics", value: 180, fill: "hsl(var(--chart-2))" },
  { name: "AWS Cloud", value: 150, fill: "hsl(var(--chart-3))" },
  { name: "Cybersecurity Analyst", value: 100, fill: "hsl(var(--chart-4))" },
  { name: "Machine Learning", value: 70, fill: "hsl(var(--chart-5))" },
];

const certificationCompletionFunnelData = [
  { stage: 'Registered', count: 300, fill: "hsl(var(--chart-1))" },
  { stage: 'In Progress', count: 220, fill: "hsl(var(--chart-2))" },
  { stage: 'Completed', count: 150, fill: "hsl(var(--chart-3))" },
  { stage: 'Verified', count: 120, fill: "hsl(var(--chart-4))" },
];

const topCoursesByCompletionData = [
    { name: "CS101 Programming", completions: 95, fill: "hsl(var(--chart-1))"},
    { name: "WD201 Web Design", completions: 80, fill: "hsl(var(--chart-2))"},
    { name: "DS305 Data Viz", completions: 70, fill: "hsl(var(--chart-3))"},
    { name: "CP401 Cloud Intro", completions: 60, fill: "hsl(var(--chart-4))"},
    { name: "SEC500 Network Security", completions: 50, fill: "hsl(var(--chart-5))"},
];

const webinarAttendanceData = [
    { name: "Intro to React", attendance: 150, fill: "hsl(var(--chart-1))" },
    { name: "Node.js Basics", attendance: 120, fill: "hsl(var(--chart-2))" },
    { name: "Data Viz Conf", attendance: 200, fill: "hsl(var(--chart-3))" },
    { name: "AI Ethics Talk", attendance: 90, fill: "hsl(var(--chart-4))" },
];
const webinarRatingsData = [
    { name: "5 Stars", value: 60, fill: "hsl(var(--chart-1))"},
    { name: "4 Stars", value: 25, fill: "hsl(var(--chart-2))"},
    { name: "3 Stars", value: 10, fill: "hsl(var(--chart-3))"},
    { name: "2 Stars", value: 3, fill: "hsl(var(--chart-4))"},
    { name: "1 Star", value: 2, fill: "hsl(var(--chart-5))"},
];
const topRatedWebinarsData = [
    {id: 'wr1', title: 'Advanced Cloud Architectures', speaker: 'Dr. Sky High', avgRating: 4.9, attendees: 180},
    {id: 'wr2', title: 'Modern Frontend Frameworks', speaker: 'Dev Guru', avgRating: 4.8, attendees: 220},
    {id: 'wr3', title: 'AI in Healthcare', speaker: 'Prof. MedAI', avgRating: 4.7, attendees: 150},
];

const portfolioStrengthData = [
    { name: "Strong Portfolio", value: 70, fill: "hsl(var(--chart-1))" },
    { name: "Needs Improvement", value: 30, fill: "hsl(var(--chart-2))" },
];
const resumeScoresByDeptData = [
    { dept: "CompSci", score: 82, fill: "hsl(var(--chart-1))" },
    { dept: "Electronics", score: 75, fill: "hsl(var(--chart-2))" },
    { dept: "Mechanical", score: 68, fill: "hsl(var(--chart-3))" },
    { dept: "Civil", score: 70, fill: "hsl(var(--chart-4))" },
];
const placementFunnelData = [
    { stage: 'Applied', count: 250, fill: "hsl(var(--chart-1))" },
    { stage: 'Interviewed', count: 120, fill: "hsl(var(--chart-2))" },
    { stage: 'Offered', count: 60, fill: "hsl(var(--chart-3))" },
    { stage: 'Placed', count: 45, fill: "hsl(var(--chart-4))" },
];
const companiesInteractedData = [
    "Tech Solutions Inc.", "Innovate Hub", "Data Weavers Ltd.", "GreenTech Innovations", "CyberSafe Corp."
];

const chartConfig = {
  logins: { label: "Logins", color: "hsl(var(--chart-1))" },
  users: { label: "Active Users", color: "hsl(var(--chart-2))" },
  views: { label: "Page Views", color: "hsl(var(--chart-3))" },
  certifications: { label: "Certifications", color: "hsl(var(--chart-1))" },
  students: { label: "Students", color: "hsl(var(--chart-2))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  completions: { label: "Completions", color: "hsl(var(--chart-1))" },
  attendance: { label: "Attendance", color: "hsl(var(--chart-1))"},
  value: {label: "Value"}, // For pie charts general value
  score: { label: "Avg Score", color: "hsl(var(--chart-1))"},
} satisfies ChartConfig;


export default function InstitutionalAnalyticsAdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    if (data.length === 0) {
      toast({ title: "No Data", description: "There is no data to download for the current selection.", variant: "default" });
      return;
    }

    const csvRows = [
      headers.join(','),
      ...data.map(row => {
        // Ensure order of values matches headers
        return headers.map(header => {
          // Convert header to a key (e.g., "Student Name" -> "name" or "studentName")
          // This is a bit naive and might need adjustment based on your actual data keys
          const key = header.toLowerCase().replace(/\s+/g, ''); 
          let value = "";
          if (key === 'studentname' && row.name) value = row.name;
          else if (key === 'email' && row.email) value = row.email;
          else if (key === 'course' && row.course) value = row.course;
          else if (key === 'certifications' && row.certifications) value = row.certifications.toString();
          else if (key === 'portfolioscore' && row.portfolioScore) value = row.portfolioScore.toString();
          else if (key === 'placementstatus' && row.placementStatus) value = row.placementStatus;
          else if (key === 'lastactive' && row.lastActive) value = row.lastActive;
          else if (key === 'title' && row.title) value = row.title;
          else if (key === 'speaker' && row.speaker) value = row.speaker;
          else if (key === 'avgrating' && row.avgRating) value = row.avgRating.toString();
          else if (key === 'attendees' && row.attendees) value = row.attendees.toString();
          else if (key === 'skills' && row.skills) value = Array.isArray(row.skills) ? row.skills.join('; ') : row.skills;
          // Add more specific key mappings if needed

          // Escape double quotes by replacing them with two double quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
      })
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const dateSuffix = format(new Date(), 'yyyy-MM-dd');
    link.setAttribute("download", `${filename}_${dateSuffix}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Download Started", description: `${filename} CSV is being downloaded.` });
  };

  const handleDownloadFilteredReport = () => {
    // In a real app, data would be fetched based on filters. Here, we use dummy data.
    const headers = ["Student Name", "Email", "Course", "Certifications", "Portfolio Score", "Placement Status", "Last Active"];
    downloadCSV(dummyStudentsForReport, "student_report", headers);
  };

  const handleDownloadTopStudents = () => {
    const headers = ["Student Name", "Course", "Portfolio Score", "Placement Status", "Skills", "Avg Rating"];
    downloadCSV(topPerformingStudentsData, "top_performing_students", headers);
  };

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
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Section 1: Engagement & Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Engagement &amp; Usage Trends</CardTitle>
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
            <div className="h-64 bg-card p-4 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2 text-center">Weekly Student Logins</h4>
              <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                <RechartsBarChart data={weeklyLoginsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="logins" radius={4}>
                     {weeklyLoginsData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            </div>
             <div className="h-64 bg-card p-4 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2 text-center">Most Active Times of Day</h4>
              <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                <RechartsBarChart data={activeTimesData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="time" type="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="users" radius={4}>
                     {activeTimesData.map((entry) => (
                        <Cell key={`cell-${entry.time}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            </div>
            <div className="h-64 bg-card p-4 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2 text-center">Top Page Views</h4>
                <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                    <RechartsBarChart data={pageUsageData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="page" fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={40}/>
                        <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="views" radius={4}>
                            {pageUsageData.map((entry) => (
                                <Cell key={`cell-${entry.page}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Skill Development & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Award className="mr-2 h-5 w-5 text-primary"/>Skill Development &amp; Certifications</CardTitle>
          <CardDescription>Analyze skill acquisition and certification achievements.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-card p-4 rounded-lg border">
            <h4 className="text-sm font-semibold mb-2 text-center">Certifications by Skill Domain</h4>
            <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                <RechartsBarChart data={skillDomainsCertificationsData} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" interval={0} height={40}/>
                    <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="certifications" radius={4}>
                        {skillDomainsCertificationsData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ChartContainer>
          </div>
          <div className="h-72 bg-card p-4 rounded-lg border flex flex-col items-center">
            <h4 className="text-sm font-semibold mb-2 text-center">Students per Skill Track</h4>
            <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                <RechartsPieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={studentsPerSkillTrackData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} stroke="hsl(var(--border))" strokeWidth={1}>
                         {studentsPerSkillTrackData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Legend wrapperStyle={{fontSize: "10px"}}/>
                </RechartsPieChart>
            </ChartContainer>
          </div>
          <div className="h-72 bg-card p-4 rounded-lg border md:col-span-2">
             <h4 className="text-sm font-semibold mb-2 text-center">Certification Completion Funnel</h4>
            <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                <RechartsBarChart data={certificationCompletionFunnelData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis dataKey="stage" type="category" fontSize={12} tickLine={false} axisLine={false} width={80}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="count" radius={4}>
                        {certificationCompletionFunnelData.map((entry) => (
                            <Cell key={`cell-${entry.stage}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ChartContainer>
          </div>
           <div className="h-72 bg-card p-4 rounded-lg border md:col-span-2">
                <h4 className="text-sm font-semibold mb-2 text-center">Top Courses by Certification Completion</h4>
                <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                    <RechartsBarChart data={topCoursesByCompletionData} margin={{ top: 5, right: 5, left: -20, bottom: 35 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} angle={-20} textAnchor="end" interval={0} height={50} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="completions" radius={4}>
                            {topCoursesByCompletionData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Webinar Analytics */}
        <Card>
            <CardHeader>
            <CardTitle className="font-headline flex items-center"><Video className="mr-2 h-5 w-5 text-primary"/>Webinar Analytics</CardTitle>
            <CardDescription>Insights into webinar engagement and effectiveness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="md:col-span-1">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Total Webinars Hosted</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">25</p><p className="text-xs text-muted-foreground">+3 last month</p></CardContent>
                    </Card>
                    <div className="md:col-span-2 h-60 bg-card p-4 rounded-lg border">
                         <h4 className="text-sm font-semibold mb-2 text-center">Top Webinars by Attendance</h4>
                        <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                            <RechartsBarChart data={webinarAttendanceData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={120} interval={0}/>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="attendance" radius={4}>
                                    {webinarAttendanceData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} /> ))}
                                </Bar>
                            </RechartsBarChart>
                        </ChartContainer>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-60 bg-card p-4 rounded-lg border flex flex-col items-center">
                        <h4 className="text-sm font-semibold mb-2 text-center">Webinar Ratings Distribution</h4>
                        <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                            <RechartsPieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie data={webinarRatingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} stroke="hsl(var(--border))" strokeWidth={1}>
                                     {webinarRatingsData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                                </Pie>
                                <Legend wrapperStyle={{fontSize: "10px"}} iconSize={10} layout="vertical" align="right" verticalAlign="middle"/>
                            </RechartsPieChart>
                        </ChartContainer>
                    </div>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Top Rated Webinars</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow><TableHead>Title</TableHead><TableHead>Rating</TableHead><TableHead>Attendees</TableHead></TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topRatedWebinarsData.map(webinar => (
                                        <TableRow key={webinar.id}>
                                            <TableCell className="text-xs">{webinar.title}</TableCell>
                                            <TableCell className="text-xs flex items-center"><Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/>{webinar.avgRating}</TableCell>
                                            <TableCell className="text-xs">{webinar.attendees}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>

      {/* Section 4: Placement Success & Portfolio Strength */}
        <Card>
            <CardHeader>
            <CardTitle className="font-headline flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Placement Success &amp; Portfolio Strength</CardTitle>
            <CardDescription>Evaluate student readiness for the job market.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-60 bg-card p-4 rounded-lg border flex flex-col items-center">
                <h4 className="text-sm font-semibold mb-2 text-center">% Students with Strong Portfolios</h4>
                 <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                    <RechartsPieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={portfolioStrengthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} stroke="hsl(var(--border))" strokeWidth={1}>
                            {portfolioStrengthData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                        </Pie>
                        <Legend wrapperStyle={{fontSize: "10px"}}/>
                    </RechartsPieChart>
                </ChartContainer>
            </div>
            <div className="h-60 bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2 text-center">Average Resume Scores by Department</h4>
                <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                    <RechartsBarChart data={resumeScoresByDeptData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="dept" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0,100]}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="score" radius={4}>
                            {resumeScoresByDeptData.map((entry) => (<Cell key={`cell-${entry.dept}`} fill={entry.fill} />))}
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            </div>
            <div className="h-60 bg-card p-4 rounded-lg border md:col-span-2">
                <h4 className="text-sm font-semibold mb-2 text-center">Placement Funnel</h4>
                 <ChartContainer config={chartConfig} className="w-full h-[calc(100%-2rem)]">
                    <RechartsBarChart data={placementFunnelData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                        <XAxis type="number" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis dataKey="stage" type="category" fontSize={12} tickLine={false} axisLine={false} width={80}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="count" radius={4}>
                            {placementFunnelData.map((entry) => (<Cell key={`cell-${entry.stage}`} fill={entry.fill} />))}
                        </Bar>
                    </RechartsBarChart>
                </ChartContainer>
            </div>
            <Card className="md:col-span-2">
                <CardHeader><CardTitle className="text-base flex items-center"><Building className="mr-2 h-4 w-4 text-primary"/>Top Companies Interacted</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {companiesInteractedData.map(company => <Badge key={company} variant="secondary">{company}</Badge>)}
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center"><Star className="mr-2 h-4 w-4 text-yellow-400 fill-yellow-400"/>Top Performing Students</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleDownloadTopStudents}><Download className="mr-1 h-3 w-3"/>Export</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead className="text-center">Portfolio Score</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topPerformingStudentsData.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="text-xs">{student.name}</TableCell>
                                    <TableCell className="text-xs">{student.course}</TableCell>
                                    <TableCell className="text-xs text-center">{student.portfolioScore}</TableCell>
                                    <TableCell className="text-xs"><Badge variant={student.placementStatus.startsWith('Placed') ? 'default' : 'secondary'}>{student.placementStatus}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
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
                 <Button className="self-end" onClick={handleDownloadFilteredReport}>
                    <Download className="mr-2 h-4 w-4" /> Generate &amp; Download Report (CSV)
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

