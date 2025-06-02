
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstitutionalAnalyticsAdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Institutional Analytics
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-body">
            This page will display detailed institutional analytics, including student engagement,
            skill development trends, placement success rates, and more.
          </p>
          <p className="text-muted-foreground font-body mt-2">
            Interactive charts, data visualizations, and filterable reports related to student
            performance and platform usage will be available here. The student analytics dialog from the main dashboard could be expanded here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
