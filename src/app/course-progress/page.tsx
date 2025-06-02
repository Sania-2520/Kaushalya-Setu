
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Milestone, Route, TrendingUp, Star, BarChart2, PieChartIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

interface Lesson {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isCompleted: boolean; // Derived from lessons
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

const initialCourseData: Course = {
  id: "webdev101",
  title: "Web Development Fundamentals",
  modules: [
    {
      id: "m1",
      title: "Module 1: Introduction to HTML",
      description: "Learn the basic structure of web pages.",
      lessons: [
        { id: "l1-1", title: "What is HTML?", isCompleted: true },
        { id: "l1-2", title: "Basic HTML Tags", isCompleted: true },
        { id: "l1-3", title: "Document Structure", isCompleted: true },
      ],
      isCompleted: true,
    },
    {
      id: "m2",
      title: "Module 2: Styling with CSS",
      description: "Discover how to make your web pages visually appealing.",
      lessons: [
        { id: "l2-1", title: "CSS Selectors", isCompleted: true },
        { id: "l2-2", title: "The Box Model", isCompleted: false },
        { id: "l2-3", title: "Flexbox Layout", isCompleted: false },
        { id: "l2-4", title: "CSS Grid", isCompleted: false },
      ],
      isCompleted: false,
    },
    {
      id: "m3",
      title: "Module 3: JavaScript Essentials",
      description: "Add interactivity to your websites.",
      lessons: [
        { id: "l3-1", title: "Variables and Data Types", isCompleted: false },
        { id: "l3-2", title: "Functions and Control Flow", isCompleted: false },
        { id: "l3-3", title: "DOM Manipulation", isCompleted: false },
      ],
      isCompleted: false,
    },
    {
      id: "m4",
      title: "Module 4: Project - Build a Portfolio Page",
      description: "Apply your knowledge to create a personal portfolio.",
      lessons: [
        { id: "l4-1", title: "Planning Your Portfolio", isCompleted: false },
        { id: "l4-2", title: "Coding the Structure (HTML)", isCompleted: false },
        { id: "l4-3", title: "Styling (CSS)", isCompleted: false },
        { id: "l4-4", title: "Adding Interactivity (JS)", isCompleted: false },
      ],
      isCompleted: false,
    },
  ],
};

const weeklyProgressData = [
  { day: "Mon", tasksCompleted: 2, hoursStudied: 1.5 },
  { day: "Tue", tasksCompleted: 3, hoursStudied: 2 },
  { day: "Wed", tasksCompleted: 1, hoursStudied: 1 },
  { day: "Thu", tasksCompleted: 4, hoursStudied: 2.5 },
  { day: "Fri", tasksCompleted: 2, hoursStudied: 1.5 },
  { day: "Sat", tasksCompleted: 5, hoursStudied: 3 },
  { day: "Sun", tasksCompleted: 1, hoursStudied: 0.5 },
];

const chartConfig = {
  tasksCompleted: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-1))",
  },
  hoursStudied: {
    label: "Hours Studied",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const motivationalMessages = [
  "Keep up the great work! Every step forward counts.",
  "You're making fantastic progress! Stay focused.",
  "Believe in yourself! Your efforts are paying off.",
  "Each day is a new opportunity to learn and grow.",
  "Success is the sum of small efforts, repeated day in and day out."
];


export default function CourseProgressPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState("");

  useEffect(() => {
    const updatedModules = initialCourseData.modules.map(module => ({
      ...module,
      isCompleted: module.lessons.every(lesson => lesson.isCompleted)
    }));
    setCourse({...initialCourseData, modules: updatedModules});
    setOverallProgress(72); 
    setCurrentMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <Route className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading course progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Milestone className="mr-3 h-8 w-8 text-primary" />
          {course.title} - Progress Map
        </h1>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-9 top-0 bottom-0 w-1 bg-border rounded-full hidden sm:block"></div>
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="relative mb-12">
            <div className={cn(
                "absolute left-9 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-2 flex items-center justify-center hidden sm:flex",
                module.isCompleted ? "bg-green-500 border-green-600" : "bg-muted border-border"
            )}>
                {module.isCompleted && <CheckCircle2 className="h-3 w-3 text-white"/>}
            </div>
            <Card className={cn(
                "ml-0 sm:ml-16 transform transition-all hover:shadow-xl",
                module.isCompleted ? "border-green-500 border-2" : "border-border",
                !module.isCompleted && moduleIndex > 0 && !course.modules[moduleIndex-1]?.isCompleted ? "opacity-60" : "opacity-100"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {module.isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 mr-2 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 mr-2 text-muted-foreground" />
                  )}
                  {module.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground ml-8">{module.description}</p>
              </CardHeader>
              <CardContent className="pl-8 sm:pl-14">
                <ul className="space-y-3">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={cn(
                        "font-body",
                        lesson.isCompleted ? "text-foreground" : "text-muted-foreground",
                        !module.isCompleted && !lesson.isCompleted && module.lessons.findIndex(l => !l.isCompleted) !== module.lessons.indexOf(lesson) ? "opacity-70" : "opacity-100"
                      )}>
                        {lesson.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {moduleIndex < course.modules.length - 1 && (
                 <div className="absolute left-9 h-12 w-1 bg-border hidden sm:block" style={{ top: 'calc(100% + 0px)'}}></div>
            )}
          </div>
        ))}
      </div>
       <Card>
        <CardHeader>
            <CardTitle>How to Update Progress</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground font-body">
                Currently, progress is pre-defined in this demonstration. In a full application,
                you would be able to mark lessons and modules as complete through course interaction pages.
            </p>
        </CardContent>
       </Card>

        <section className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold font-headline text-center">Your Learning Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Certifications Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Detailed chart showing your earned certifications by domain will appear here soon.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-accent" />Goals At a Glance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Visual summary of your completed vs. pending goals will be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-green-500" />Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A radar chart or similar visualization tracking your skill growth over time is planned for this section.</p>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-6 mt-6 border-t">
                <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        <TrendingUp className="mr-2 h-6 w-6 text-primary"/>
                        Daily Activity (Sample for this Week)
                    </CardTitle>
                    <CardDescription>Overview of tasks completed and study hours (sample data).</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart accessibilityLayer data={weeklyProgressData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="tasksCompleted" fill="var(--color-tasksCompleted)" radius={4} />
                        <Bar dataKey="hoursStudied" fill="var(--color-hoursStudied)" radius={4} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
                </Card>
                
                <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        <Star className="mr-2 h-6 w-6 text-accent"/>
                        Your Momentum
                    </CardTitle>
                    <CardDescription>Your simulated overall progress and motivation.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="my-6">
                        <Progress value={overallProgress} className="h-3 mb-2" />
                        <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                        <p className="text-sm text-muted-foreground">Overall Engagement (Sample)</p>
                    </div>
                    <div className="mt-6 p-4 bg-accent/10 rounded-md">
                        <p className="text-sm font-semibold text-accent-foreground mb-1">Stay Motivated:</p>
                        <p className="text-xs text-accent-foreground/80 italic">
                            "{currentMotivationalMessage}"
                        </p>
                    </div>
                </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}
