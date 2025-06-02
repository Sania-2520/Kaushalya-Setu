
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Award, Users, MessageSquare, Zap, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Skill Portfolio Builder',
    description: 'Create impressive profiles, upload projects, and showcase your skills with an intuitive interface.',
    link: '/portfolio',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Micro-Certifications',
    description: 'Earn verifiable digital skill badges through short courses and in-app assessments.',
    link: '/certifications',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Skill Tagging',
    description: 'Automatically identify and tag relevant skills from your projects to enhance your portfolio.',
    link: '/portfolio',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: 'Career Matchmaking',
    description: 'Get smart recommendations for internships and jobs based on your unique skills and portfolio.',
    link: '/smart-recommendations',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Live Webinars & Mentorship',
    description: 'Connect with industry experts, participate in Q&A forums, and get valuable mentorship.',
    link: '/live-sessions',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
            Kaushalya Setu
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4 font-body">
            Your Bridge to a Brighter Future. Empowering Karnataka's Polytechnic Talent.
          </p>
          <div className="mt-8 space-x-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#features-section">Explore Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features-section" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline">
            Unlock Your Potential
          </h2>
          <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl text-center mt-4 mb-12 font-body">
            Discover a platform designed to certify your skills, build your portfolio, and connect you with the right opportunities.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4 text-xl font-semibold font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/70 text-center font-body">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                   <Button variant="link" className="w-full text-primary" asChild>
                     <Link href={feature.link}>Learn More &rarr;</Link>
                   </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Students collaborating"
            data-ai-hint="students collaboration"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-semibold">
                Industry Connect
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Partner with Emerging Talent
              </h2>
              <p className="max-w-[600px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Are you an MSME or startup in Karnataka? Post internships and jobs, and find skilled polytechnic graduates ready to contribute.
              </p>
            </div>
            <Button asChild className="w-fit">
              <Link href="/industry-partner">Become an Industry Partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
