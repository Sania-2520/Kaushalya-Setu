
"use client";

import { Lightbulb, Briefcase, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function SmartRecommendationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Lightbulb className="mr-3 h-8 w-8 text-primary" />
          AI-Powered Career Matchmaking
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unlock Your Personalized Career Path</CardTitle>
          <CardDescription>
            Our Smart Recommendation Engine uses cutting-edge AI to connect your unique skills and portfolio projects
            with the most relevant internship and job opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="AI Matching Process"
                data-ai-hint="ai connection network"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-headline">How It Works:</h3>
              <ul className="list-disc list-inside space-y-2 font-body text-foreground/80">
                <li>
                  <strong>Showcase Your Skills:</strong> Your portfolio, projects, and listed skills are the foundation. The more detail you provide, the better the matches!
                </li>
                <li>
                  <strong>AI Analysis:</strong> Our system intelligently analyzes your profile content to understand your strengths and experience.
                </li>
                <li>
                  <strong>Opportunity Matching:</strong> We compare your profile against available job and internship postings from our industry partners.
                </li>
                <li>
                  <strong>Personalized Recommendations:</strong> Receive a curated list of opportunities with a relevance score, helping you focus on the best fits.
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center space-y-4 pt-6 border-t">
            <h3 className="text-xl font-semibold font-headline">Ready to Find Your Match?</h3>
            <p className="text-muted-foreground font-body">
              Ensure your portfolio is up-to-date and then explore the opportunities waiting for you.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/portfolio">
                  <UserCheck className="mr-2 h-5 w-5" /> Update Your Portfolio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" /> View Job Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
