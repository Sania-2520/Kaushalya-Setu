
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Target, Edit3, Trash2, CheckCircle2, Circle, CalendarIcon, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  status: "pending" | "done";
  createdAt: Date;
}

const initialGoals: Goal[] = [
  { id: "1", title: "Complete AI Module on Kaushalya Setu", description: "Finish all lessons and assessments for the Introduction to AI micro-certification.", priority: "high", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: "pending", createdAt: new Date() },
  { id: "2", title: "Attend 3 Webinars this Month", description: "Participate in at least three live sessions related to web development or data science.", priority: "medium", status: "pending", createdAt: new Date() },
  { id: "3", title: "Update Portfolio with New Project", description: "Add the recently completed e-commerce project to the portfolio.", priority: "high", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: "done", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Partial<Goal>>({});
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentGoal(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: "low" | "medium" | "high") => {
    setCurrentGoal(prev => ({ ...prev, priority: value }));
  };
  
  const handleDateChange = (date?: Date) => {
    setCurrentGoal(prev => ({ ...prev, dueDate: date }));
  };

  const openFormForNew = () => {
    setCurrentGoal({ priority: "medium", status: "pending" });
    setEditingGoalId(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (goal: Goal) => {
    setCurrentGoal(goal);
    setEditingGoalId(goal.id);
    setIsFormOpen(true);
  };
  
  const handleSubmitGoal = () => {
    if (!currentGoal.title?.trim()) {
      toast({ title: "Title Missing", description: "Please provide a title for your goal.", variant: "destructive"});
      return;
    }

    if (editingGoalId) {
      setGoals(goals.map(g => g.id === editingGoalId ? { ...g, ...currentGoal } as Goal : g));
      toast({ title: "Goal Updated!", description: `"${currentGoal.title}" has been updated.`});
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: currentGoal.title!,
        description: currentGoal.description || "",
        priority: currentGoal.priority || "medium",
        dueDate: currentGoal.dueDate,
        status: "pending",
        createdAt: new Date(),
      };
      setGoals([newGoal, ...goals]);
      toast({ title: "Goal Added!", description: `"${newGoal.title}" is now being tracked.`});
    }
    setIsFormOpen(false);
    setCurrentGoal({});
    setEditingGoalId(null);
  };

  const toggleGoalStatus = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, status: g.status === "pending" ? "done" : "pending" } : g));
    const goal = goals.find(g => g.id === id);
    if (goal) {
        toast({ title: "Status Updated!", description: `Goal "${goal.title}" marked as ${goal.status === "pending" ? "done" : "pending"}.`});
    }
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find(g => g.id === id);
    setGoals(goals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({ title: "Goal Deleted", description: `"${goalToDelete.title}" has been removed.`, variant: "destructive" });
    }
  };

  const pendingGoals = goals.filter(g => g.status === 'pending').sort((a,b) => (a.dueDate?.getTime() || Infinity) - (b.dueDate?.getTime() || Infinity));
  const completedGoals = goals.filter(g => g.status === 'done').sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Target className="mr-3 h-8 w-8 text-primary" /> My Goals
        </h1>
        <Button onClick={openFormForNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </div>

      {isFormOpen && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{editingGoalId ? "Edit Goal" : "Add New Goal"}</CardTitle>
            <CardDescription>Define what you want to achieve.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goalTitle">Goal Title*</Label>
              <Input id="goalTitle" name="title" value={currentGoal.title || ""} onChange={handleInputChange} placeholder="e.g., Learn React Basics" />
            </div>
            <div>
              <Label htmlFor="goalDescription">Description (Optional)</Label>
              <Textarea id="goalDescription" name="description" value={currentGoal.description || ""} onChange={handleInputChange} placeholder="Add more details about your goal" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="goalPriority">Priority</Label>
                    <Select value={currentGoal.priority || "medium"} onValueChange={handlePriorityChange}>
                    <SelectTrigger id="goalPriority">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="goalDueDate">Due Date (Optional)</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !currentGoal.dueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentGoal.dueDate ? format(currentGoal.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={currentGoal.dueDate}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitGoal}>{editingGoalId ? "Save Changes" : "Add Goal"}</Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400"/>Smart Goal Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AI-powered goal suggestions based on your progress, interests, and trending skills will appear here soon.
          </p>
          <Button variant="outline" className="mt-3" disabled>Get Suggestions (Coming Soon)</Button>
        </CardContent>
      </Card>

      <section className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold mb-4 font-headline">Pending Goals ({pendingGoals.length})</h2>
            {pendingGoals.length === 0 ? (
                <p className="text-muted-foreground">No pending goals. Great job, or add some new ones!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggleStatus={toggleGoalStatus} onEdit={openFormForEdit} onDelete={deleteGoal} />)}
                </div>
            )}
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-4 font-headline">Completed Goals ({completedGoals.length})</h2>
             {completedGoals.length === 0 ? (
                <p className="text-muted-foreground">No goals completed yet. Keep pushing!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggleStatus={toggleGoalStatus} onEdit={openFormForEdit} onDelete={deleteGoal} />)}
                </div>
            )}
        </div>
      </section>
    </div>
  );
}

interface GoalCardProps {
    goal: Goal;
    onToggleStatus: (id: string) => void;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
}

function GoalCard({ goal, onToggleStatus, onEdit, onDelete }: GoalCardProps) {
    const priorityColor = {
        low: "bg-blue-100 text-blue-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-red-100 text-red-700",
    };
    return (
        <Card className={cn("flex flex-col", goal.status === 'done' ? "bg-muted/50" : "")}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className={cn("text-lg font-semibold", goal.status === 'done' && "line-through text-muted-foreground")}>{goal.title}</CardTitle>
                    <Badge className={cn("text-xs", priorityColor[goal.priority])}>{goal.priority}</Badge>
                </div>
                {goal.dueDate && <p className="text-xs text-muted-foreground">Due: {format(goal.dueDate, "PPP")}</p>}
            </CardHeader>
            <CardContent className="flex-grow">
                <p className={cn("text-sm text-foreground/80", goal.status === 'done' && "line-through text-muted-foreground")}>
                    {goal.description || "No description provided."}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-3">
                <Button variant="ghost" size="sm" onClick={() => onToggleStatus(goal.id)} className="text-sm">
                    {goal.status === 'pending' ? <Circle className="mr-2 h-4 w-4 text-orange-500" /> : <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
                    {goal.status === 'pending' ? 'Mark as Done' : 'Mark as Pending'}
                </Button>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onEdit(goal)}><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => onDelete(goal.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            </CardFooter>
        </Card>
    )
}

