
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users, BarChart3, Settings, Download } from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();

  const handleDownloadProgress = () => {
    toast({
      title: "Progress Report Initiated",
      description: "Student progress report (CSV/Excel format) is being generated and will be available for download.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
          Polytechnic Admin Dashboard
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is your central hub for managing Kaushalya Setu platform activities related to your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body">
            From here, you can (eventually) manage student accounts, view institutional analytics, oversee industry partnerships, and configure platform settings specific to your polytechnic.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl font-semibold font-headline">Manage Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-body mb-4">
              View student profiles, track progress, manage enrollments, and download student progress reports.
            </p>
            <Button onClick={handleDownloadProgress} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download Progress Report
            </Button>
          </CardContent>
        </Card>
        <FeatureCard
          icon={<BarChart3 className="h-8 w-8 text-primary" />}
          title="Institutional Analytics"
          description="Access reports on student engagement, skill development, and placement success."
        />
        <FeatureCard
          icon={<Settings className="h-8 w-8 text-primary" />}
          title="Platform Settings"
          description="Configure institution-specific settings and integrations."
        />
      </div>
       <Card className="mt-8">
        <CardHeader>
            <CardTitle>Placeholder Content</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground font-body">
                This page is a placeholder for the Polytechnic Admin Dashboard. 
                More specific functionalities and data visualizations will be added here in future iterations.
            </p>
        </CardContent>
       </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-xl font-semibold font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );
}
