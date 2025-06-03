
// src/app/knowledge-base/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KNOWLEDGE_BASE_DATA } from './data';
import { ArrowRight, BookOpenText } from 'lucide-react';
import Image from 'next/image';

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center">
         <BookOpenText className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
          Knowledge Base Explorer
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80 font-body">
          Embark on a learning journey through various IT sectors. Select a domain to explore interactive course maps and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KNOWLEDGE_BASE_DATA.map((sector) => (
          <Link key={sector.id} href={`/knowledge-base/${sector.id}`} passHref>
            <Card className="h-full flex flex-col hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardHeader className="items-center text-center">
                <sector.IconComponent className="h-12 w-12 text-primary mb-3 transition-transform duration-300 group-hover:scale-110" />
                <CardTitle className="font-headline text-xl">{sector.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <CardDescription className="font-body">{sector.description}</CardDescription>
              </CardContent>
              <div className="p-4 pt-0 text-center">
                <div className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  Explore Path <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-12 bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="font-headline text-center">Ready to Dive In?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-accent-foreground/90 font-body">
                Each sector offers a unique, gamified learning map. Complete courses, earn (conceptual) badges, and master new skills!
            </p>
            <div className="mt-6">
                <Image
                    src="https://images.unsplash.com/photo-1604933834413-4cbe62737214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8bGVhcm5pbmclMjBhZHZlbnR1cmUlMjB1c2luZyUyMGFpfGVufDB8fHx8MTc0ODkyOTgyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Learning Adventure"
                    width={600}
                    height={300}
                    className="rounded-lg mx-auto shadow-md"
                    data-ai-hint="gamified learning map"
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
