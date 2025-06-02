
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Star, BarChart2, PieChartIcon as ShadCNPieIcon, Activity, Edit3, Trash2, PlusCircle, Target, CalendarIcon, CheckCircle, Award, Clock, Milestone, BookOpen, CheckSquare, Hourglass, Zap } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface Certification {
  id: string;
  title: string;
  domain: string;
  progress: number; // 0-100
  status: 'Not Started' | 'In Progress' | 'Completed';
  dateStarted?: Date;
  deadline?: Date;
  badgeEarned?: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  status: 'pending' | 'done';
  createdAt: Date;
}

const initialCertifications: Certification[] = [
  { id: 'cert1', title: 'Web Development Bootcamp', domain: 'Web Development', progress: 100, status: 'Completed', dateStarted: new Date(2023, 0, 15), deadline: new Date(2023, 5, 15), badgeEarned: 'Full-Stack Dev' },
  { id: 'cert2', title: 'AI Fundamentals', domain: 'Artificial Intelligence', progress: 60, status: 'In Progress', dateStarted: new Date(2023, 6, 1), deadline: new Date(2023, 9, 1) },
  { id: 'cert3', title: 'Data Science Specialization', domain: 'Data Science', progress: 25, status: 'In Progress', dateStarted: new Date(2023, 8, 10) },
  { id: 'cert4', title: 'Cybersecurity Essentials', domain: 'Cybersecurity', progress: 0, status: 'Not Started' },
];

const initialGoals: Goal[] = [
  { id: "g1", title: "Finish React Module", description: "Complete all lessons in the React section of Web Dev Bootcamp.", status: "pending", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { id: "g2", title: "Build 2 Portfolio Projects", description: "Create two new projects to showcase skills.", status: "pending", createdAt: new Date() },
  { id: "g3", title: "Network with 5 Professionals", description: "Attend meetups or use LinkedIn.", status: "done", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
];

const motivationalMessages = [
  "Keep pushing, you're doing great!",
  "Every goal achieved is a victory!",
  "Small steps lead to big results.",
  "Your dedication is inspiring!",
  "One step closer to greatness!"
];

const goalCompletionQuotes = [
  "You're not done yet, but you're closer than yesterday.",
  "Each tick is a step to the version of you you're meant to become.",
  "Success is built on consistency — and you're showing up.",
  "The journey of a thousand miles begins with a single step. You just took another one!",
  "Well done! What's next on your list to conquer?"
];

// Dummy data for charts
const certificationsByDomainData = [
  { domain: 'Web Dev', count: 1, fill: "hsl(var(--chart-1))" },
  { domain: 'AI/ML', count: 1, fill: "hsl(var(--chart-2))"  },
  { domain: 'Data Sci', count: 1, fill: "hsl(var(--chart-3))"  },
  { domain: 'CyberSec', count: 0, fill: "hsl(var(--chart-4))"  },
  { domain: 'Cloud', count: 0, fill: "hsl(var(--chart-5))"  },
];

const skillProficiencyData = [
  { skill: 'React', proficiency: 75, fill: "hsl(var(--chart-1))" },
  { skill: 'Python', proficiency: 60, fill: "hsl(var(--chart-2))" },
  { skill: 'SQL', proficiency: 80, fill: "hsl(var(--chart-3))" },
  { skill: 'Communication', proficiency: 85, fill: "hsl(var(--chart-4))" },
  { skill: 'Problem Solving', proficiency: 70, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  count: { label: "Count", color: "hsl(var(--chart-1))" },
  proficiency: { label: "Proficiency", color: "hsl(var(--chart-1))" },
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  pending: { label: "Pending", color: "hsl(var(--chart-2))" },
  webDev: { label: "Web Dev", color: "hsl(var(--chart-1))" },
  aiML: { label: "AI/ML", color: "hsl(var(--chart-2))" },
  dataSci: { label: "Data Science", color: "hsl(var(--chart-3))" },
  cyberSec: { label: "Cybersecurity", color: "hsl(var(--chart-4))" },
  cloud: { label: "Cloud", color: "hsl(var(--chart-5))" },
  react: { label: "React", color: "hsl(var(--chart-1))" },
  python: { label: "Python", color: "hsl(var(--chart-2))" },
  sql: { label: "SQL", color: "hsl(var(--chart-3))" },
  communication: { label: "Communication", color: "hsl(var(--chart-4))" },
  problemSolving: { label: "Problem Solving", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function MyProgressPage() {
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState("");
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Partial<Goal>>({});
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
  }, []);

  const overallCertificationsProgress = useMemo(() => {
    const completedCount = certifications.filter(c => c.status === 'Completed').length;
    return certifications.length > 0 ? Math.round((completedCount / certifications.length) * 100) : 0;
  }, [certifications]);

  const certificationsStarted = useMemo(() => certifications.filter(c => c.status !== 'Not Started').length, [certifications]);
  const certificationsInProgress = useMemo(() => certifications.filter(c => c.status === 'In Progress').length, [certifications]);
  const certificationsCompletedCount = useMemo(() => certifications.filter(c => c.status === 'Completed').length, [certifications]);

  const pendingGoals = goals.filter(g => g.status === 'pending').sort((a, b) => (a.deadline?.getTime() || Infinity) - (b.deadline?.getTime() || Infinity));
  const completedGoals = goals.filter(g => g.status === 'done').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const goalsChartData = [
    { name: 'Pending', value: pendingGoals.length, fill: "hsl(var(--chart-2))" },
    { name: 'Completed', value: completedGoals.length, fill: "hsl(var(--chart-1))" },
  ];

  const handleMarkCertificationComplete = (id: string, isCompleted: boolean) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id 
        ? { ...cert, status: isCompleted ? 'Completed' : 'In Progress', progress: isCompleted ? 100 : (cert.progress < 100 ? cert.progress : 50) } 
        : cert
    ));
  };

  const handleGoalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalDateChange = (date?: Date) => {
    setCurrentGoal(prev => ({ ...prev, deadline: date }));
  };

  const openNewGoalForm = () => {
    setCurrentGoal({ status: "pending" });
    setEditingGoalId(null);
    setIsGoalFormOpen(true);
  };

  const openEditGoalForm = (goal: Goal) => {
    setCurrentGoal(goal);
    setEditingGoalId(goal.id);
    setIsGoalFormOpen(true);
  };
  
  const handleSubmitGoal = () => {
    if (!currentGoal.title?.trim()) {
      toast({ title: "Title Missing", description: "Goal title is required.", variant: "destructive" });
      return;
    }
    if (editingGoalId) {
      setGoals(goals.map(g => g.id === editingGoalId ? { ...currentGoal, id: editingGoalId, createdAt: g.createdAt } as Goal : g));
      toast({ title: "Goal Updated!", description: `"${currentGoal.title}" has been updated.` });
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: currentGoal.title!,
        description: currentGoal.description,
        deadline: currentGoal.deadline,
        status: "pending",
        createdAt: new Date(),
      };
      setGoals([newGoal, ...goals]);
      toast({ title: "Goal Added!", description: `"${newGoal.title}" is now tracked.` });
    }
    setIsGoalFormOpen(false);
    setCurrentGoal({});
    setEditingGoalId(null);
  };

  const toggleGoalStatus = (id: string) => {
    let goalTitle = "";
    let newStatusIsDone = false;
    setGoals(goals.map(g => {
      if (g.id === id) {
        goalTitle = g.title;
        newStatusIsDone = g.status === "pending";
        return { ...g, status: newStatusIsDone ? "done" : "pending" };
      }
      return g;
    }));

    if (newStatusIsDone) {
      const randomQuote = goalCompletionQuotes[Math.floor(Math.random() * goalCompletionQuotes.length)];
      toast({
        title: "Goal Achieved!",
        description: (
          <div className="flex flex-col gap-1">
            <span>{`"${goalTitle}" marked as done.`}</span>
            <span className="italic text-xs text-primary mt-1">{randomQuote}</span>
          </div>
        ),
        duration: 5000,
      });
    } else {
      toast({ title: "Status Updated", description: `"${goalTitle}" marked as pending.` });
    }
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find(g => g.id === id);
    setGoals(goals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({ title: "Goal Deleted", description: `"${goalToDelete.title}" has been removed.`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Milestone className="mr-3 h-8 w-8 text-primary" />
          My Progress Tracker
        </h1>
      </div>

      {/* Section 1: Certifications Tracker */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Award className="mr-2 h-6 w-6 text-primary"/>Certifications Tracker</CardTitle>
            <CardDescription>Monitor your progress across various skill certifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm font-medium">
                <span>Overall Completion</span>
                <span>{overallCertificationsProgress}%</span>
              </div>
              <Progress value={overallCertificationsProgress} className="h-3" />
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <p><CheckSquare className="inline h-3 w-3 mr-1 text-blue-500"/>Started: {certificationsStarted}</p>
                <p><Hourglass className="inline h-3 w-3 mr-1 text-yellow-500"/>In Progress: {certificationsInProgress}</p>
                <p><CheckCircle className="inline h-3 w-3 mr-1 text-green-500"/>Completed: {certificationsCompletedCount}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {certifications.map(cert => (
                <Card key={cert.id} className={cn("transition-all", cert.status === 'Completed' ? 'bg-green-500/10 border-green-500/50' : 'bg-card')}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-semibold">{cert.title}</CardTitle>
                      <Badge variant={cert.status === 'Completed' ? 'default' : 'secondary'}
                        className={cn(cert.status === 'Completed' ? 'bg-green-600 text-white' : cert.status === 'In Progress' ? 'bg-yellow-500/80 text-white' : '')}
                      >{cert.status}</Badge>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">{cert.domain}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <Progress value={cert.progress} className="h-2" />
                    <div className="flex justify-between text-muted-foreground">
                      <span>{cert.dateStarted ? `Started: ${format(cert.dateStarted, "dd MMM yy")}` : 'Not Started'}</span>
                      {cert.deadline && <span>Deadline: {format(cert.deadline, "dd MMM yy")}</span>}
                    </div>
                    {cert.status === 'Completed' && cert.badgeEarned && (
                      <Badge variant="default" className="mt-1 bg-primary/80 text-primary-foreground"><Award className="h-3 w-3 mr-1"/>{cert.badgeEarned}</Badge>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`cert-${cert.id}`} 
                        checked={cert.status === 'Completed'} 
                        onCheckedChange={(checked) => handleMarkCertificationComplete(cert.id, checked)}
                      />
                      <Label htmlFor={`cert-${cert.id}`} className="text-xs">Mark as Completed</Label>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Goals Tracker */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold font-headline flex items-center"><Target className="mr-2 h-6 w-6 text-accent"/>Goals Tracker</h2>
            <Button onClick={openNewGoalForm} size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Add New Goal</Button>
        </div>
        {goals.length === 0 ? (
            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No goals set yet. Start planning your achievements!</p></CardContent></Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map(goal => (
                    <Card key={goal.id} className={cn("flex flex-col", goal.status === 'done' ? "bg-muted/60" : "")}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className={cn("text-md font-semibold leading-tight", goal.status === 'done' && "line-through text-muted-foreground")}>{goal.title}</CardTitle>
                                <Checkbox 
                                    checked={goal.status === 'done'} 
                                    onCheckedChange={() => toggleGoalStatus(goal.id)}
                                    className="ml-2 mt-1 shrink-0"
                                    aria-label={`Mark goal ${goal.title} as ${goal.status === 'done' ? 'pending' : 'done'}`}
                                />
                            </div>
                            {goal.deadline && (
                                <Badge 
                                    variant={goal.deadline < new Date() && goal.status === 'pending' ? 'destructive' : 'outline'} 
                                    className="text-xs w-fit mt-1"
                                >
                                    <CalendarIcon className="h-3 w-3 mr-1.5"/> Due: {format(goal.deadline, "dd MMM yy")}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="text-sm text-foreground/80 flex-grow">
                            <p className={cn(goal.status === 'done' && "line-through text-muted-foreground")}>
                                {goal.description || "No description provided."}
                            </p>
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditGoalForm(goal)}><Edit3 className="h-4 w-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteGoal(goal.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </section>

      {/* Learning Insights Section */}
      <section className="space-y-6 pt-8 border-t">
        <h2 className="text-2xl font-semibold font-headline text-center">Your Learning Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Certifications by Domain</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={certificationsByDomainData} layout="vertical" margin={{ right: 20, left:10 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="count" hide/>
                  <YAxis dataKey="domain" type="category" tickLine={false} axisLine={false} tickMargin={5} width={80}/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" radius={5}>
                     {certificationsByDomainData.map((entry) => (
                        <Cell key={`cell-${entry.domain}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><ShadCNPieIcon className="mr-2 h-5 w-5 text-accent" />Goals At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center">
              <ChartContainer config={chartConfig} className="w-full h-full max-w-[200px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={goalsChartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={2}>
                     {goalsChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Legend/>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Activity className="mr-2 h-5 w-5 text-green-500" />Skill Proficiency (Sample)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={skillProficiencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="skill" tickLine={false} axisLine={false} tickMargin={5} />
                  <YAxis domain={[0,100]} allowDataOverflow={true} tickFormatter={(value) => `${value}%`}/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="proficiency" radius={4}>
                    {skillProficiencyData.map((entry) => (
                      <Cell key={`cell-${entry.skill}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* Overall Activity Section */}
       <section className="space-y-6 pt-8 border-t">
         <h2 className="text-2xl font-semibold font-headline text-center">Overall Activity Snapshot</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">28</p></CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Learning Hours</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">72<span className="text-base">hrs</span></p></CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Skills Mastered</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">12</p></CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Streak</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">14 <span className="text-base">days</span></p></CardContent>
            </Card>
         </div>
      </section>


      <div className="grid grid-cols-1 pt-6 mt-6 border-t">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Star className="mr-2 h-6 w-6 text-accent"/>
              Your Momentum
            </CardTitle>
            <CardDescription>Your overall platform engagement and progress.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="my-6">
              <Progress value={overallCertificationsProgress} className="h-3 mb-2" />
              <p className="text-3xl font-bold text-primary">{overallCertificationsProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Engagement</p>
            </div>
            <div className="mt-6 p-4 bg-accent/10 rounded-md">
              <p className="text-sm font-semibold text-accent-foreground mb-1">Stay Motivated:</p>
              <p className="text-xs text-accent-foreground/80 italic">
                "{currentMotivationalMessage}"
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/knowledge-base">
                <BookOpen className="mr-2 h-4 w-4" /> Explore More Learning Paths
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Goal Add/Edit Dialog */}
      <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingGoalId ? "Edit Goal" : "Add New Goal"}</DialogTitle>
            <DialogDescription>Define your objective and optionally set a deadline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <Label htmlFor="goalTitle">Title*</Label>
              <Input id="goalTitle" name="title" value={currentGoal.title || ""} onChange={handleGoalInputChange} />
            </div>
            <div>
              <Label htmlFor="goalDescription">Description (Optional)</Label>
              <Textarea id="goalDescription" name="description" value={currentGoal.description || ""} onChange={handleGoalInputChange} />
            </div>
            <div>
              <Label htmlFor="goalDeadline">Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="goalDeadline"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !currentGoal.deadline && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentGoal.deadline ? format(currentGoal.deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={currentGoal.deadline} onSelect={handleGoalDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitGoal}>{editingGoalId ? "Save Changes" : "Add Goal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    