
"use client";

import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Link from "next/link";

export default function ResumeReviewerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-6">
      <Construction className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-3xl font-bold font-headline mb-4">Feature Not Available</h1>
      <p className="text-muted-foreground font-body max-w-md mb-8">
        The AI Resume Analyzer feature has been removed. Please check back later or explore other features.
      </p>
      <Button asChild>
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}

    