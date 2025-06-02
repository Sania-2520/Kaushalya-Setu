"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, BookOpen, Users, MessageSquare, UserCircle, LogIn } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
  { href: '/jobs', label: 'Jobs', icon: <Users className="h-5 w-5" /> },
  { href: '/live-sessions', label: 'Live Sessions', icon: <MessageSquare className="h-5 w-5" /> },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
          <span className="font-bold sm:inline-block font-headline text-primary">
            Kaushalya Setu
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary font-semibold" : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:flex">
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href ? "bg-accent text-accent-foreground font-semibold" : "text-foreground"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <Button variant="outline" asChild className="w-full justify-start mb-2">
                     <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                     </Link>
                  </Button>
                  <Button asChild className="w-full justify-start">
                    <Link href="/signup">
                       Sign Up
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
