
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlatformSettingsAdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          Platform Settings
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institution Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-body">
            This page will allow administrators to configure institution-specific settings,
            manage integrations, and customize certain aspects of the Kaushalya Setu platform
            for their polytechnic.
          </p>
           <p className="text-muted-foreground font-body mt-2">
            Examples include setting up academic calendars, department structures, or specific notification preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
