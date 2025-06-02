
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Milestone, Route, TrendingUp, Star, BarChart2, PieChartIcon, Activity, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    // In a real app, you'd fetch the user's active course progress
    // For now, we'll leave it empty as requested
    setCourse(null); 
    setOverallProgress(0); 
    setCurrentMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Milestone className="mr-3 h-8 w-8 text-primary" />
          {course ? `${course.title} - Progress Map` : "My Course Progress"}
        </h1>
      </div>

      {course ? (
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">No Active Course</CardTitle>
            <CardDescription>
              You are not currently enrolled in a specific course track, or progress data is not available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body mb-4">
              Your progress for specific courses and micro-certifications will appear here once you start them.
              You can explore available learning paths in the Knowledge Base.
            </p>
            <Button asChild>
              <Link href="/knowledge-base">
                <BookOpen className="mr-2 h-4 w-4" /> Explore Knowledge Base
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
       
        <section className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold font-headline text-center">Your Learning Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Certifications Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Detailed chart showing your earned certifications by domain will appear here soon.</p>
                        <div className="h-48 bg-muted/30 rounded-lg mt-2 flex items-center justify-center text-muted-foreground italic">Placeholder: Certifications Chart</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-accent" />Goals At a Glance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Visual summary of your completed vs. pending goals will be displayed here.</p>
                        <div className="h-48 bg-muted/30 rounded-lg mt-2 flex items-center justify-center text-muted-foreground italic">Placeholder: Goals Chart</div>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-green-500" />Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A radar chart or similar visualization tracking your skill growth over time is planned for this section.</p>
                    <div className="h-64 bg-muted/30 rounded-lg mt-2 flex items-center justify-center text-muted-foreground italic">Placeholder: Skill Growth Chart</div>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-6 mt-6 border-t">
                <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        <TrendingUp className="mr-2 h-6 w-6 text-primary"/>
                        Your Overall Activity
                    </CardTitle>
                    <CardDescription>General platform engagement and learning momentum.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full flex items-center justify-center text-muted-foreground italic bg-muted/30 rounded-lg">
                    Placeholder: Activity Metrics (e.g., logins, tasks completed, etc.)
                </CardContent>
                </Card>
                
                <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        <Star className="mr-2 h-6 w-6 text-accent"/>
                        Your Momentum
                    </CardTitle>
                    <CardDescription>Your overall platform engagement.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="my-6">
                        <Progress value={overallProgress} className="h-3 mb-2" />
                        <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                        <p className="text-sm text-muted-foreground">Overall Engagement</p>
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

      