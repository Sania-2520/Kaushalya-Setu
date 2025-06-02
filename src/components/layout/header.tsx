
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, BookOpen, Users, MessageSquare, LogIn, User, Settings, LogOut as LogOutIcon } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: '/', label: 'Home', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
  { href: '/jobs', label: 'Jobs', icon: <Users className="h-5 w-5" /> },
  { href: '/live-sessions', label: 'Live Sessions', icon: <MessageSquare className="h-5 w-5" /> },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setLoggedIn(userLoggedIn);
    }
  }, [pathname, isClient]);

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('isLoggedIn');
      setLoggedIn(false);
      router.push('/login');
    }
  };

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
          {loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png?text=U" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    {/* <p className="text-xs leading-none text-muted-foreground">user@example.com</p> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/portfolio')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/account-settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}

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
                  {!loggedIn && (
                    <>
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
                    </>
                  )}
                   {loggedIn && (
                     <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                        <LogOutIcon className="mr-2 h-4 w-4" /> Log out
                     </Button>
                   )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
