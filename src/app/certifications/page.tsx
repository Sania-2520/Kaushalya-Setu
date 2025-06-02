
"use client";

import { Award, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CertificationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Award className="mr-3 h-8 w-8 text-primary" />
          Micro-Certifications
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earn Verifiable Skill Badges</CardTitle>
          <CardDescription>
            Our Micro-Certification system allows you to take short course modules followed by in-app assessments. 
            Upon successful completion, you'll be issued verifiable digital skill badges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Construction className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold font-headline mb-2">Content Coming Soon!</h2>
            <p className="text-muted-foreground font-body mb-6">
              We're working hard to bring you exciting micro-certification modules. 
              Check back soon to start earning your skill badges!
            </p>
            <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline">How it will work:</h3>
            <ul className="list-disc list-inside space-y-2 font-body text-foreground/80">
              <li>Browse available micro-certification modules.</li>
              <li>Complete the learning materials at your own pace.</li>
              <li>Pass the in-app assessment to test your knowledge.</li>
              <li>Receive a verifiable digital badge for your portfolio.</li>
              <li>Showcase your certified skills to potential employers.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
