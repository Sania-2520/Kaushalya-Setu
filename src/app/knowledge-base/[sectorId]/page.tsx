
// src/app/knowledge-base/[sectorId]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { KNOWLEDGE_BASE_DATA, CourseNodeData } from '../data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, Play, CheckCircle2, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';


const getStatusIcon = (status: CourseNodeData['status']) => {
  switch (status) {
    case 'locked':
      return <Lock className="h-5 w-5 text-muted-foreground" />;
    case 'available':
      return <Play className="h-5 w-5 text-green-500 fill-green-500" />;
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500" />;
    default:
      return null;
  }
};

const FloatingIslandPath = ({ courses, sectorTheme }: { courses: CourseNodeData[], sectorTheme: string }) => {
  // Simple alternating layout for path effect
  // In a real scenario, positions might come from data or a more complex layout algorithm
  return (
    <div className="relative p-4 md:p-8 min-h-[60vh]">
      {/* Background - placeholder for theme */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-lg",
        sectorTheme === 'floating-islands' ? 'bg-blue-100/30' : 'bg-slate-800/10'
      )}>
        {sectorTheme === 'floating-islands' && (
          <Image 
            src="https://placehold.co/1200x800.png?text=Floating+Islands+Theme" 
            alt="Floating Islands Theme"
            layout="fill"
            objectFit="cover"
            className="opacity-20 rounded-lg"
            data-ai-hint="fantasy sky islands"
          />
        )}
         {sectorTheme === 'circuit-board' && (
          <Image 
            src="https://placehold.co/1200x800.png?text=Circuit+Board+Theme" 
            alt="Circuit Board Theme"
            layout="fill"
            objectFit="cover"
            className="opacity-10 rounded-lg"
            data-ai-hint="tech circuit pattern"
          />
        )}
      </div>

      {courses.map((course, index) => (
        <div
          key={course.id}
          className={cn(
            "relative mb-10 md:mb-16 flex items-center",
            index % 2 === 0 ? "justify-start" : "justify-end"
          )}
          style={{ 
            // Add some vertical stagger for visual appeal
            transform: `translateY(${index * 5}px)` 
          }}
        >
          {/* Path Connector - very basic, needs improvement for complex paths */}
          {index < courses.length - 1 && (
            <div
              className={cn(
                "absolute w-1 bg-primary/30 -z-10",
                // This calculation is very rough and needs a proper algorithm for a nice path
                // For now, a simple vertical line.
                "h-[100px] md:h-[120px] left-1/2 -translate-x-1/2", 
                index % 2 === 0 ? "top-full" : "bottom-full",
                
              )}
               style={{
                  top: '50%', // Center vertically relative to its row
                  height: 'calc(100% + 4rem)', // Connect to next row, adjust as needed
                  // Could try diagonal lines with transforms + pseudo-elements if needed
               }}
            />
          )}

          <Card
            className={cn(
              "w-full max-w-xs md:max-w-sm p-3 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
              course.status === 'locked' ? 'bg-muted/70 border-muted-foreground/30 cursor-not-allowed' : 'bg-card cursor-pointer',
              course.status === 'completed' ? 'border-blue-500 border-2' : '',
              course.status === 'available' ? 'border-green-500 border-2' : '',
              sectorTheme === 'floating-islands' ? 'rounded-xl shadow-lg' : 'rounded-md border-primary/50',
            )}
            onClick={() => course.status === 'available' ? alert(`Opening course: ${course.title}`) : null}
          >
            <CardHeader className="p-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base md:text-lg font-semibold line-clamp-1">{course.title}</CardTitle>
              {getStatusIcon(course.status)}
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              {course.status === 'completed' && course.badgeEarned && (
                <div className="mt-2 flex items-center text-xs text-amber-600">
                  <Award className="h-4 w-4 mr-1 text-amber-500" />
                  Badge: {course.badgeEarned}
                </div>
              )}
               {course.status !== 'locked' && (
                <div className="mt-2 flex items-center">
                    {[...Array(course.status === 'completed' ? 5 : (course.level % 5))].map((_, i) => ( // Mock stars
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(course.status === 'completed' ? 0 : 5 - (course.level % 5))].map((_, i) => (
                         <Star key={i+5} className="h-3 w-3 text-muted-foreground/50" />
                    ))}
                </div>
               )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};


export default function SectorMapPage() {
  const router = useRouter();
  const params = useParams();
  const sectorId = params.sectorId as string;
  
  const [sector, setSector] = useState<typeof KNOWLEDGE_BASE_DATA[0] | null>(null);

  useEffect(() => {
    const currentSector = KNOWLEDGE_BASE_DATA.find(s => s.id === sectorId);
    if (currentSector) {
      setSector(currentSector);
    } else {
      // Handle sector not found, e.g., redirect or show error
      router.push('/knowledge-base');
    }
  }, [sectorId, router]);

  if (!sector) {
    return <div className="flex items-center justify-center h-screen"><p>Loading sector map...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/knowledge-base')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sectors
        </Button>
        <div className="text-right">
            <h1 className="text-3xl font-bold font-headline text-primary">{sector.name} Learning Path</h1>
            <p className="text-muted-foreground">{sector.description}</p>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <FloatingIslandPath courses={sector.courses} sectorTheme={sector.theme} />
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Map Legend</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500" /> Completed Level</div>
            <div className="flex items-center gap-2"><Play className="h-5 w-5 text-green-500 fill-green-500" /> Available Level</div>
            <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-muted-foreground" /> Locked Level</div>
        </CardContent>
      </Card>
    </div>
  );
}
