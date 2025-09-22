
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, BookOpen, Users, MessageSquare, LogIn, User, Settings, LogOut as LogOutIcon, Route, BookOpenText, Target, Sparkles, GraduationCap, BarChart3, LayoutDashboard, Building, Edit, FileText, PieChart, CalendarCheck2, Search, FileSignature, ScanSearch, Presentation } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const studentNavLinks = [
  { href: '/', label: 'Home', icon: <GraduationCap className="h-5 w-5" /> },
  { href: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-5 w-5" /> },
  { href: '/resume-builder', label: 'Resume Builder', icon: <FileSignature className="h-5 w-5" /> },
  { href: '/resume-reviewer', label: 'Resume Analyzer', icon: <ScanSearch className="h-5 w-5" /> },
  
  { href: '/live-sessions', label: 'Webinars', icon: <Presentation className="h-5 w-5" /> },
  { href: '/course-progress', label: 'My Progress', icon: <Route className="h-5 w-5" /> },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: <BookOpenText className="h-5 w-5" /> },
];

const adminNavLinks = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/admin-dashboard/manage-students', label: 'Manage Students', icon: <Users className="h-5 w-5" /> },
  { href: '/admin-dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { href: '/admin-dashboard/platform-settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

const industryNavLinks = [
    { href: '/industry-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/industry-dashboard/post-job', label: 'Post Job/Internship', icon: <Edit className="h-5 w-5" /> },
    { href: '/industry-dashboard/schedule-webinar', label: 'Schedule Webinar', icon: <CalendarCheck2 className="h-5 w-5" /> },
    { href: '/industry-dashboard/review-portfolios', label: 'Review Portfolios', icon: <Search className="h-5 w-5" /> },
    { href: '/industry-dashboard/track-impact', label: 'Track Impact', icon: <PieChart className="h-5 w-5" /> },
];


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("My Account"); // Could be student name or company name
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [polytechnicName, setPolytechnicName] = useState<string | null>(null); // For student or polytechnic admin
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null); // For industry partner
  const [userRole, setUserRole] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setLoggedIn(userLoggedIn);
      if (userLoggedIn) {
        setUserName(localStorage.getItem('userName') || "User");
        setUserEmail(localStorage.getItem('userEmail'));
        setPolytechnicName(localStorage.getItem('polytechnicName'));
        setCompanyLogoUrl(localStorage.getItem('companyLogoUrl'));
        setUserRole(localStorage.getItem('userRole'));
      } else {
        setUserName("My Account");
        setUserEmail(null);
        setPolytechnicName(null);
        setCompanyLogoUrl(null);
        setUserRole(null);
      }
    }
  }, [pathname, isClient]);


  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('polytechnicName');
      localStorage.removeItem('companyName');
      localStorage.removeItem('companyLogoUrl');
      localStorage.removeItem('industrySector');
      localStorage.removeItem('skillsSeeking');
      setLoggedIn(false);
      setUserRole(null);
      router.push('/login');
    }
  };

  let navLinksToDisplay: Array<{ href: string; label: string; icon: JSX.Element }> = [];
  if (loggedIn) {
    if (userRole === 'student') {
      navLinksToDisplay = studentNavLinks;
    } else if (userRole === 'polytechnic') {
      navLinksToDisplay = adminNavLinks;
    } else if (userRole === 'industry') {
      navLinksToDisplay = industryNavLinks;
    }
  }

  const isSpecialPortal = loggedIn && (userRole === 'polytechnic' || userRole === 'industry');
  const portalDashboardPath = userRole === 'polytechnic' ? "/admin-dashboard" : userRole === 'industry' ? "/industry-dashboard" : "/";


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={isSpecialPortal ? portalDashboardPath : "/"} className="mr-6 flex items-center space-x-2">
          <Logo />
          <span className="font-bold sm:inline-block font-headline text-primary">
            Kaushalya Setu
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
          {navLinksToDisplay.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary text-xs lg:text-sm",
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
                    {userRole === 'industry' && companyLogoUrl ? (
                         <AvatarImage src={companyLogoUrl} alt={userName} data-ai-hint="company logo small"/>
                    ) : (
                         <AvatarImage src="https://placehold.co/40x40.png?text=U" alt={userName} data-ai-hint="user avatar"/>
                    )}
                    <AvatarFallback>{userName.substring(0,1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    {userEmail && <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>}
                    {polytechnicName && (userRole === 'student' || userRole === 'polytechnic') && <p className="text-xs leading-none text-muted-foreground">{polytechnicName}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {userRole === 'student' && (
                  <DropdownMenuItem onClick={() => router.push('/portfolio')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                )}
                {isSpecialPortal && (
                     <DropdownMenuItem onClick={() => router.push(portalDashboardPath)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                )}
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
                <Link href="/role-select">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:flex">
                <Link href="/role-select">
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
                {navLinksToDisplay.map((link) => (
                  <Link
                    key={link.label} 
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
                         <Link href="/role-select">
                            <LogIn className="mr-2 h-4 w-4" /> Login
                         </Link>
                      </Button>
                      <Button asChild className="w-full justify-start">
                        <Link href="/role-select">
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
