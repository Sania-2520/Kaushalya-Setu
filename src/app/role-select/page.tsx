
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { GraduationCap, Briefcase, LayoutPanelLeft, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RoleSelectPage() {
  const router = useRouter();

  const roles = [
    {
      name: "Student",
      description: "Build your portfolio, learn new skills, and find opportunities.",
      icon: <GraduationCap className="h-10 w-10 mb-3 text-primary" />,
      loginPath: "/login?role=student",
      signupPath: "/signup?role=student",
      dataAiHint: "student graduation"
    },
    {
      name: "Industry Partner",
      description: "Discover talent, post jobs, and connect with polytechnics.",
      icon: <Briefcase className="h-10 w-10 mb-3 text-primary" />,
      loginPath: "/login?role=industry",
      signupPath: "/signup?role=industry",
      dataAiHint: "industry briefcase"
    },
    {
      name: "Polytechnic Admin",
      description: "Manage your institution's presence and student progress.",
      icon: <LayoutPanelLeft className="h-10 w-10 mb-3 text-primary" />,
      loginPath: "/login?role=polytechnic",
      signupPath: "/signup?role=polytechnic",
      dataAiHint: "admin dashboard"
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
          Welcome to Kaushalya Setu!
        </h1>
        <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-3 font-body">
          Please select your role to login or create an account.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {roles.map((role) => (
          <Card 
            key={role.name} 
            className="flex flex-col items-center text-center p-6 transform transition-all duration-300 hover:shadow-xl"
            data-ai-hint={role.dataAiHint}
          >
            <CardHeader className="items-center p-0">
              {role.icon}
              <CardTitle className="text-xl font-semibold font-headline">{role.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2 flex-grow">
              <CardDescription className="font-body text-sm">{role.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-6 w-full">
              <Button asChild className="w-full">
                <Link href={role.loginPath}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={role.signupPath}>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
