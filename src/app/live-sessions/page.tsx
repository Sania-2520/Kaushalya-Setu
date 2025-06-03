
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, MessageSquare, Send, Star, User, Video, Presentation, Layers } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface Session {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar?: string;
  dateTime: Date;
  durationMinutes: number;
  description: string;
  tags: string[];
  domain: string; // Added domain field
  platformLink?: string;
  coverImage?: string;
  isLive?: boolean;
  attendees?: number;
  rating?: number;
  totalRatings?: number;
}

interface QnAItem {
  id: string;
  user: string;
  userAvatar?: string;
  question: string;
  timestamp: Date;
  answer?: string;
  answeredBy?: string;
  answerTimestamp?: Date;
}

const ALL_DOMAINS_FILTER = "All Domains";

const generateInitialSessions = (): Session[] => [
  {
    id: "1",
    title: "Mastering React Hooks",
    speaker: "Jane Doe",
    speakerRole: "Senior Frontend Engineer @ Google",
    speakerAvatar: "https://placehold.co/100x100.png?text=JD",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    durationMinutes: 60,
    description: "Deep dive into React Hooks, best practices, and advanced patterns. Suitable for intermediate developers.",
    tags: ["React", "Frontend", "JavaScript"],
    domain: "Web Development",
    coverImage: "https://placehold.co/600x300.png?text=React+Hooks+Webinar",
    isLive: false,
    attendees: 120,
    rating: 4.8,
    totalRatings: 85,
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js",
    speaker: "John Smith",
    speakerRole: "Principal Engineer @ Amazon",
    speakerAvatar: "https://placehold.co/100x100.png?text=JS",
    dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    durationMinutes: 90,
    description: "Learn how to design and build robust, scalable APIs using Node.js, Express, and microservices architecture.",
    tags: ["Node.js", "Backend", "API", "Microservices"],
    domain: "Backend Development",
    coverImage: "https://placehold.co/600x300.png?text=Node.js+API+Workshop",
    isLive: false,
    attendees: 250,
    rating: 4.5,
    totalRatings: 150,
  },
  {
    id: "3",
    title: "Introduction to UI/UX Design Principles",
    speaker: "Alice Brown",
    speakerRole: "Lead UX Designer @ Microsoft",
    speakerAvatar: "https://placehold.co/100x100.png?text=AB",
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    durationMinutes: 45,
    description: "Understand the fundamental principles of UI/UX design to create user-friendly and engaging digital products.",
    tags: ["UI/UX", "Design", "User Experience"],
    domain: "UI/UX Design",
    coverImage: "https://placehold.co/600x300.png?text=UI/UX+Design+Talk",
    isLive: false,
    attendees: 0, // Upcoming
  },
  {
    id: "4",
    title: "AI Fundamentals for Developers",
    speaker: "Dr. AI Expert",
    speakerRole: "AI Research Scientist",
    speakerAvatar: "https://placehold.co/100x100.png?text=AI",
    dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    durationMinutes: 75,
    description: "An overview of Artificial Intelligence concepts, machine learning basics, and how developers can integrate AI into their projects.",
    tags: ["AI", "Machine Learning", "Development"],
    domain: "Artificial Intelligence",
    coverImage: "https://placehold.co/600x300.png?text=AI+Fundamentals",
    isLive: false,
  },
   {
    id: "5",
    title: "Cloud Native Architectures on AWS",
    speaker: "CloudGuru Sam",
    speakerRole: "AWS Solutions Architect",
    speakerAvatar: "https://placehold.co/100x100.png?text=CS",
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    durationMinutes: 90,
    description: "Explore best practices for building and deploying cloud-native applications on Amazon Web Services.",
    tags: ["AWS", "Cloud Computing", "Architecture"],
    domain: "Cloud Computing",
    coverImage: "https://placehold.co/600x300.png?text=AWS+Cloud+Native",
    isLive: false,
    attendees: 180,
    rating: 4.7,
    totalRatings: 120,
  },
];

const generateInitialQnA = (): QnAItem[] => [
    {
        id: 'q1',
        user: 'Student A',
        question: 'What is the best way to manage state in large React applications?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        answer: 'Consider using context API for simpler cases, or Redux/Zustand for more complex state management.',
        answeredBy: 'Jane Doe', 
        answerTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 'q2',
        user: 'Student B',
        question: 'How do you handle authentication in Node.js APIs?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    }
];


export default function WebinarsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [qnaItems, setQnaItems] = useState<QnAItem[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>(ALL_DOMAINS_FILTER);

  useEffect(() => {
    const initialSessionsData = generateInitialSessions();
    setSessions(initialSessionsData);
    setQnaItems(generateInitialQnA());
    // Auto-select the first upcoming session if available, otherwise first overall
    const firstUpcoming = initialSessionsData.find(s => s.dateTime > new Date() && !s.isLive);
    if (firstUpcoming) {
      setSelectedSession(firstUpcoming);
    } else if (initialSessionsData.length > 0) {
      setSelectedSession(initialSessionsData[0]);
    }
  }, []);
  
  const uniqueDomains = useMemo(() => {
    const domains = new Set(sessions.map(s => s.domain));
    return [ALL_DOMAINS_FILTER, ...Array.from(domains).sort()];
  }, [sessions]);

  const filteredSessionsByDomain = useMemo(() => {
    if (selectedDomain === ALL_DOMAINS_FILTER) {
      return sessions;
    }
    return sessions.filter(s => s.domain === selectedDomain);
  }, [sessions, selectedDomain]);

  const upcomingSessions = useMemo(() => {
    return filteredSessionsByDomain
      .filter(s => s.dateTime > new Date() && !s.isLive)
      .sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [filteredSessionsByDomain]);

  const pastSessions = useMemo(() => {
    return filteredSessionsByDomain
      .filter(s => s.dateTime <= new Date() && !s.isLive)
      .sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());
  }, [filteredSessionsByDomain]);
  
  const liveSessions = useMemo(() => {
    return filteredSessionsByDomain.filter(s => s.isLive);
  }, [filteredSessionsByDomain]);


  const handleAskQuestion = () => {
    if (newQuestion.trim() === "") return;
    const question: QnAItem = {
      id: `q${Date.now()}`,
      user: "Current User", 
      question: newQuestion,
      timestamp: new Date(),
    };
    setQnaItems([question, ...qnaItems]);
    setNewQuestion("");
  };

  const handleRateSession = (rating: number) => {
    setUserRating(rating);
    if(selectedSession){
        const newTotalRatings = (selectedSession.totalRatings || 0) + 1;
        const newAverageRating = ((selectedSession.rating || 0) * (selectedSession.totalRatings || 0) + rating) / newTotalRatings;
        
        const updatedSession = {...selectedSession, rating: newAverageRating, totalRatings: newTotalRatings};
        setSelectedSession(updatedSession);
        
        setSessions(prevSessions => prevSessions.map(s => 
            s.id === selectedSession.id ? updatedSession : s
        ));
    }
  };


  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/3 space-y-6">
        <h2 className="text-2xl font-semibold font-headline flex items-center">
          <Presentation className="mr-2 h-6 w-6 text-primary" /> Webinars
        </h2>
        
        <div className="space-y-2">
            <Label htmlFor="domainFilter" className="text-sm font-medium">Filter by Domain</Label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger id="domainFilter">
                    <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueDomains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
            <TabsTrigger value="live">Live ({liveSessions.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastSessions.length})</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-320px)] mt-4 pr-3"> {/* Adjusted height for filter */}
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
                <SessionListItem key={session.id} session={session} onSelect={setSelectedSession} isSelected={selectedSession?.id === session.id} />
              )) : <p className="text-muted-foreground p-4 text-center">No upcoming webinars {selectedDomain !== ALL_DOMAINS_FILTER ? `in ${selectedDomain}` : ''}.</p>}
            </TabsContent>
            <TabsContent value="live" className="space-y-4">
              {liveSessions.length > 0 ? liveSessions.map(session => (
                <SessionListItem key={session.id} session={session} onSelect={setSelectedSession} isSelected={selectedSession?.id === session.id} />
              )) : <p className="text-muted-foreground p-4 text-center">No webinars currently live {selectedDomain !== ALL_DOMAINS_FILTER ? `in ${selectedDomain}` : ''}.</p>}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {pastSessions.length > 0 ? pastSessions.map(session => (
                <SessionListItem key={session.id} session={session} onSelect={setSelectedSession} isSelected={selectedSession?.id === session.id} />
              )) : <p className="text-muted-foreground p-4 text-center">No past webinars found {selectedDomain !== ALL_DOMAINS_FILTER ? `in ${selectedDomain}` : ''}.</p>}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </aside>

      <main className="lg:w-2/3">
        {selectedSession ? (
          <Card className="overflow-hidden shadow-lg">
            {selectedSession.coverImage && (
              <div className="aspect-video relative">
                <Image src={selectedSession.coverImage} alt={selectedSession.title} layout="fill" objectFit="cover" data-ai-hint="webinar technology"/>
                {selectedSession.isLive && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">LIVE</Badge>
                )}
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-headline">{selectedSession.title}</CardTitle>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <Layers className="h-3.5 w-3.5" /> <span>Domain: {selectedSession.domain}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <CalendarDays className="h-4 w-4" /> <span>{selectedSession.dateTime.toLocaleDateString()}</span>
                <Clock className="h-4 w-4" /> <span>{selectedSession.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({selectedSession.durationMinutes} mins)</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedSession.speakerAvatar} alt={selectedSession.speaker} data-ai-hint="speaker portrait"/>
                  <AvatarFallback>{selectedSession.speaker.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedSession.speaker}</p>
                  <p className="text-xs text-muted-foreground">{selectedSession.speakerRole}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 font-body">{selectedSession.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSession.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
              {selectedSession.isLive && selectedSession.platformLink && (
                <Button asChild className="mt-6 w-full sm:w-auto">
                  <a href={selectedSession.platformLink} target="_blank" rel="noopener noreferrer">
                    <Video className="mr-2 h-4 w-4" /> Join Live Webinar
                  </a>
                </Button>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm font-semibold">Rate this webinar:</p>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'
                      }`}
                      onClick={() => handleRateSession(star)}
                    />
                  ))}
                </div>
                {selectedSession.rating && selectedSession.totalRatings ? (
                    <p className="text-xs text-muted-foreground mt-1">
                        Avg. Rating: {selectedSession.rating.toFixed(1)}/5 ({selectedSession.totalRatings} ratings)
                    </p>
                ) : <p className="text-xs text-muted-foreground mt-1">Not rated yet.</p>}
              </div>
              {selectedSession.attendees && selectedSession.attendees > 0 && <p className="text-sm text-muted-foreground">{selectedSession.attendees} attendees</p>}
            </CardFooter>

            <div className="p-6 border-t">
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><MessageSquare className="h-5 w-5 mr-2 text-primary" /> Q&A Forum</h3>
                <div className="space-y-3 mb-4">
                    <Textarea 
                        placeholder="Ask a question..." 
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="min-h-[80px]"
                    />
                    <Button onClick={handleAskQuestion} disabled={!newQuestion.trim()}>
                        <Send className="mr-2 h-4 w-4" /> Ask Question
                    </Button>
                </div>
                <ScrollArea className="h-[300px] pr-3">
                    {qnaItems.length > 0 ? qnaItems.map(q => (
                        <div key={q.id} className="mb-4 p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={q.userAvatar || `https://placehold.co/40x40.png?text=${q.user.substring(0,1)}`} data-ai-hint="user avatar"/>
                                    <AvatarFallback>{q.user.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{q.user} <span className="text-xs text-muted-foreground font-normal ml-1">{q.timestamp.toLocaleTimeString()}</span></p>
                                    <p className="text-foreground/90 text-sm mt-0.5">{q.question}</p>
                                </div>
                            </div>
                            {q.answer && (
                                <div className="mt-2 ml-6 pl-5 border-l border-primary/50">
                                     <div className="flex items-start space-x-3">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={(selectedSession?.speakerAvatar && q.answeredBy === selectedSession.speaker) ? selectedSession.speakerAvatar : `https://placehold.co/40x40.png?text=${(q.answeredBy || 'S').substring(0,1)}`} data-ai-hint="speaker avatar"/>
                                            <AvatarFallback>{(q.answeredBy || selectedSession?.speaker || 'S').substring(0,1)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm text-primary">{q.answeredBy || selectedSession?.speaker} (Speaker) <span className="text-xs text-muted-foreground font-normal ml-1">{q.answerTimestamp?.toLocaleTimeString()}</span></p>
                                            <p className="text-foreground/80 text-sm mt-0.5">{q.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-muted-foreground text-sm text-center py-4">No questions yet. Be the first to ask!</p>}
                </ScrollArea>
            </div>

          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-card rounded-lg p-8 text-center">
            <Presentation className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold font-headline mb-2">Select a webinar</h2>
            <p className="text-muted-foreground font-body">Choose a webinar from the list to see its details and participate in Q&A.</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface SessionListItemProps {
  session: Session;
  onSelect: (session: Session) => void;
  isSelected: boolean;
}

function SessionListItem({ session, onSelect, isSelected }: SessionListItemProps) {
  return (
    <Card 
        className={`cursor-pointer hover:shadow-md transition-all ${isSelected ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-transparent'}`}
        onClick={() => onSelect(session)}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage src={session.speakerAvatar} alt={session.speaker} data-ai-hint="speaker avatar small"/>
            <AvatarFallback className="rounded-md">{session.speaker.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm line-clamp-1">{session.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{session.speaker} - {session.domain}</p>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" /> {session.dateTime.toLocaleDateString([], {month: 'short', day: 'numeric'})}
              <Clock className="h-3 w-3 mr-1 ml-2" /> {session.dateTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </div>
          </div>
          {session.isLive && <Badge variant="destructive" className="text-xs h-fit">LIVE</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}


    