
"use client"; // Required for charts and client-side interactions

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Award, Users, MessageSquare, Zap, Lightbulb, Route, TrendingUp, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { useEffect, useState } from 'react';


const features = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Skill Portfolio Builder',
    description: 'Create impressive profiles, upload projects, and showcase your skills with an intuitive interface.',
    link: '/portfolio',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Micro-Certifications',
    description: 'Earn verifiable digital skill badges through short courses and in-app assessments.',
    link: '/certifications',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Skill Tagging',
    description: 'Automatically identify and tag relevant skills from your projects to enhance your portfolio.',
    link: '/portfolio',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: 'Career Matchmaking',
    description: 'Get smart recommendations for internships and jobs based on your unique skills and portfolio.',
    link: '/smart-recommendations',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Live Webinars & Mentorship',
    description: 'Connect with industry experts, participate in Q&A forums, and get valuable mentorship.',
    link: '/live-sessions',
  },
  {
    icon: <Route className="h-10 w-10 text-primary" />,
    title: 'Course Progress Tracker',
    description: 'Visualize your learning journey with a map-like structure for courses and modules.',
    link: '/course-progress',
  },
];

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

export default function HomePage() {
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState("");

  useEffect(() => {
    // Simulate fetching or calculating progress for non-logged-in user
    // For demonstration, we'll set a static value and pick a random message
    setOverallProgress(65); 
    setCurrentMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
            Kaushalya Setu
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4 font-body">
            Your Bridge to a Brighter Future. Empowering Karnataka's Polytechnic Talent.
          </p>
          <div className="mt-8 space-x-0 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#features-section">Explore Opportunities</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/#progress-tracker-section">Track Your Progress</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="progress-tracker-section" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Track Your Daily Progress
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl mt-4 font-body">
              Visualize your learning journey and stay motivated! This is a sample tracker. Log in for personalized progress.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-primary"/>
                    Sample Weekly Activity
                </CardTitle>
                <CardDescription>Tasks completed and hours studied this week (sample data).</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] w-full">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart accessibilityLayer data={weeklyProgressData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                    Overall Goal
                </CardTitle>
                <CardDescription>Your simulated progress towards course completion.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="my-6">
                    <Progress value={overallProgress} className="h-3 mb-2" />
                    <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                    <p className="text-sm text-muted-foreground">Course Completion (Sample)</p>
                </div>
                <div className="mt-6 p-4 bg-accent/10 rounded-md">
                    <p className="text-sm font-semibold text-accent-foreground mb-1">Motivational Tip:</p>
                    <p className="text-xs text-accent-foreground/80 italic">
                        "{currentMotivationalMessage}"
                    </p>
                </div>
                 <Button variant="outline" className="mt-6 w-full" asChild>
                    <Link href="/course-progress">View Full Learning Map</Link>
                 </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features-section" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline">
            Unlock Your Potential
          </h2>
          <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl text-center mt-4 mb-12 font-body">
            Discover a platform designed to certify your skills, build your portfolio, and connect you with the right opportunities.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4 text-xl font-semibold font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/70 text-center font-body">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                   <Button variant="link" className="w-full text-primary" asChild>
                     <Link href={feature.link}>Learn More &rarr;</Link>
                   </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Students collaborating"
            data-ai-hint="students collaboration"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-semibold">
                Industry Connect
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Partner with Emerging Talent
              </h2>
              <p className="max-w-[600px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Are you an MSME or startup in Karnataka? Post internships and jobs, and find skilled polytechnic graduates ready to contribute.
              </p>
            </div>
            <Button asChild className="w-fit">
              <Link href="/jobs">Become an Industry Partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
