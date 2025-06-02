
"use client";
// This file is kept for potential future use if internal job applications are re-introduced.
// For JSearch integration, applications are typically handled externally.

import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DeprecatedApplyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
        <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Application System Update</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
            We are currently using an external job search provider. 
            Applications are typically handled directly on the job provider's website.
            This internal application page is not active for external job listings.
        </p>
        <Button asChild><Link href="/jobs">Back to Job Listings</Link></Button>
    </div>
  );
}
