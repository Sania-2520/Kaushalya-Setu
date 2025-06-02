
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ApplicationSubmittedContent() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("jobTitle");
  const company = searchParams.get("company");

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-primary">Application Submitted!</CardTitle>
          <CardDescription className="font-body">
            {jobTitle && company ? `Your application for ${jobTitle} at ${company} has been successfully submitted.` : "Your application has been successfully submitted."}
            <br/>We wish you the best of luck!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-muted-foreground">
            You can track the status of your applications in your dashboard (feature coming soon).
            Companies will reach out to you via the email you provided if they wish to proceed.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/jobs">
                <Briefcase className="mr-2 h-4 w-4" /> Back to Job Listings
              </Link>
            </Button>
             <Button asChild variant="outline">
              <Link href="/portfolio">
                View Your Portfolio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ApplicationSubmittedPage() {
    return (
        <Suspense fallback={<div>Loading confirmation...</div>}>
            <ApplicationSubmittedContent />
        </Suspense>
    )
}

    