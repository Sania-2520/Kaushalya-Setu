
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Edit, CalendarCheck2, Users, PieChart, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function IndustryDashboardPage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching logged-in industry partner's data
    setCompanyName(localStorage.getItem('companyName') || "Your Company");
    setCompanyLogoUrl(localStorage.getItem('companyLogoUrl'));
  }, []);

  const dashboardLinks = [
    { title: "Post Job/Internship", description: "Create and manage job or internship listings for students.", href: "/industry-dashboard/post-job", icon: <Edit className="h-8 w-8 text-primary" /> },
    { title: "Schedule Webinars", description: "Organize webinars, workshops, or mentorship programs.", href: "/industry-dashboard/schedule-webinar", icon: <CalendarCheck2 className="h-8 w-8 text-primary" /> },
    { title: "Review Student Portfolios", description: "Discover talented students and review their profiles.", href: "/industry-dashboard/review-portfolios", icon: <Users className="h-8 w-8 text-primary" /> },
    { title: "Track Impact & Analytics", description: "View analytics on your engagement and its impact.", href: "/industry-dashboard/track-impact", icon: <PieChart className="h-8 w-8 text-primary" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {companyLogoUrl ? (
            <Image src={companyLogoUrl} alt={`${companyName} Logo`} width={64} height={64} className="rounded-md border bg-card" data-ai-hint="company logo"/>
          ) : (
            <Briefcase className="h-16 w-16 text-primary" />
          )}
          <div>
            <h1 className="text-3xl font-bold font-headline">
              {companyName} Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome to your Industry Partner Portal.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><LayoutDashboard className="mr-2 h-6 w-6 text-primary"/> Dashboard Overview</CardTitle>
          <CardDescription>Access various tools to connect with polytechnic talent and manage your activities on Kaushalya Setu.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body">
            From here, you can post job opportunities, schedule webinars, review student portfolios, and track the impact of your engagement.
            Use the links below or the header navigation to get started.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardLinks.map(link => (
          <Card key={link.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              {link.icon}
              <CardTitle className="text-xl font-semibold font-headline">{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">
                {link.description}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href={link.href}>
                  Go to {link.title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
