
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Briefcase, LayoutPanelLeft } from "lucide-react";
import Link from "next/link";

export default function SelectPortalPage() {
  const router = useRouter();

  const portals = [
    {
      name: "Student Portal",
      description: "Access your portfolio, projects, and skill development resources.",
      icon: <GraduationCap className="h-12 w-12 mb-4 text-primary" />,
      path: "/portfolio",
      dataAiHint: "student cap"
    },
    {
      name: "Industry Partner Portal",
      description: "Post job openings, find talent, and connect with polytechnic students.",
      icon: <Briefcase className="h-12 w-12 mb-4 text-primary" />,
      path: "/jobs",
      dataAiHint: "briefcase work"
    },
    {
      name: "Polytechnic Admin Portal",
      description: "Manage student data, track progress, and oversee platform activities.",
      icon: <LayoutPanelLeft className="h-12 w-12 mb-4 text-primary" />,
      path: "/admin-dashboard",
      dataAiHint: "admin panel"
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
          Choose Your Portal
        </h1>
        <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-3 font-body">
          Select the portal that best represents your role to continue.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {portals.map((portal) => (
          <Card 
            key={portal.name} 
            className="flex flex-col items-center text-center p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            onClick={() => router.push(portal.path)}
            data-ai-hint={portal.dataAiHint}
          >
            <CardHeader className="items-center p-0">
              {portal.icon}
              <CardTitle className="text-2xl font-semibold font-headline">{portal.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2 flex-grow">
              <CardDescription className="font-body">{portal.description}</CardDescription>
            </CardContent>
            <Button variant="link" className="mt-4 text-primary font-semibold">
              Go to {portal.name.replace(" Portal", "")} &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

