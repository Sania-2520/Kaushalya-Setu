
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, ArrowLeft, Briefcase, Building, Search } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { useToast } from "@/hooks/use-toast";
import { IT_KEYWORDS } from "@/lib/constants"; // For skills suggestions

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupComponent />
    </Suspense>
  )
}

function SignupComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(""); // For student or admin personal name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Student specific
  const [studentPolytechnicName, setStudentPolytechnicName] = useState<string>("");
  const [courseDepartment, setCourseDepartment] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  
  // Polytechnic Admin specific
  const [adminInstitutionName, setAdminInstitutionName] = useState<string>("");

  // Industry Partner specific
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [industrySector, setIndustrySector] = useState("");
  const [skillsSeeking, setSkillsSeeking] = useState(""); // Comma-separated or textarea
  
  const [isClient, setIsClient] = useState(false);
  const [isRoleFromQuery, setIsRoleFromQuery] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery) {
      setSelectedRole(roleFromQuery);
      setIsRoleFromQuery(true);
    }
  }, [searchParams]);

  const handleSignup = () => {
    if (!fullName && (selectedRole === 'student' || selectedRole === 'polytechnic')) {
        toast({ title: "Missing Fields", description: "Full name is required.", variant: "destructive" });
        return;
    }
    if (!email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in email and password fields.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (!selectedRole) {
      toast({ title: "Role not selected", description: "Please select your role.", variant: "destructive" });
      return;
    }

    let userNameToStore = fullName; // Default to fullName

    if (selectedRole === "student") {
        if (!studentPolytechnicName || !courseDepartment || !semester) {
            toast({ title: "Student Info Missing", description: "Polytechnic name, course, and semester are required for students.", variant: "destructive" });
            return;
        }
    } else if (selectedRole === "polytechnic") {
        if (!adminInstitutionName.trim()) {
            toast({ title: "Institution Info Missing", description: "Polytechnic Institution Name is required for admins.", variant: "destructive" });
            return;
        }
    } else if (selectedRole === "industry") {
        if (!companyName || !industrySector || !skillsSeeking) {
             toast({ title: "Industry Partner Info Missing", description: "Company Name, Sector, and Skills Seeking are required.", variant: "destructive" });
            return;
        }
        userNameToStore = companyName; // For industry partner, use company name as the display name
    }


    if (isClient) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userName', userNameToStore); // Use companyName for industry, fullName otherwise
      localStorage.setItem('userEmail', email);
      
      if (selectedRole === 'student') {
        localStorage.setItem('polytechnicName', studentPolytechnicName);
      } else if (selectedRole === 'polytechnic') {
        localStorage.setItem('polytechnicName', adminInstitutionName); // Admin's institution
      } else if (selectedRole === 'industry') {
        localStorage.setItem('companyName', companyName);
        if (companyLogoUrl) localStorage.setItem('companyLogoUrl', companyLogoUrl);
        localStorage.setItem('industrySector', industrySector);
        localStorage.setItem('skillsSeeking', skillsSeeking);
      }
    }

    toast({
      title: "Signup Successful!",
      description: `Welcome, ${userNameToStore}! Redirecting you...`,
    });

    switch (selectedRole) {
      case "student":
        router.push("/portfolio");
        break;
      case "industry":
        router.push("/industry-dashboard");
        break;
      case "polytechnic":
        router.push("/admin-dashboard");
        break;
      default:
        router.push("/"); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">
            Create Account {selectedRole && `as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
          </CardTitle>
          <CardDescription>Join Kaushalya Setu and start building your future.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {selectedRole === 'student' || selectedRole === 'polytechnic' ? (
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isRoleFromQuery}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="industry">Industry Partner</SelectItem>
                <SelectItem value="polytechnic">Polytechnic Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student Specific Fields */}
          {selectedRole === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="studentPolytechnicName">Polytechnic Name</Label>
                <Input id="studentPolytechnicName" type="text" placeholder="Your polytechnic" value={studentPolytechnicName} onChange={(e) => setStudentPolytechnicName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDepartment">Course/Department</Label>
                <Input id="courseDepartment" type="text" placeholder="e.g., Computer Science" value={courseDepartment} onChange={(e) => setCourseDepartment(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <SelectItem key={sem} value={sem.toString()}>{sem.toString()}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Polytechnic Admin Specific Fields */}
          {selectedRole === 'polytechnic' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="adminInstitutionName">Polytechnic Institution Name</Label>
                <Input id="adminInstitutionName" type="text" placeholder="Name of your polytechnic institution" value={adminInstitutionName} onChange={(e) => setAdminInstitutionName(e.target.value)} required />
              </div>
            </>
          )}

           {/* Industry Partner Specific Fields */}
          {selectedRole === 'industry' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" type="text" placeholder="Your company's name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLogoUrl">Company Logo URL (Optional)</Label>
                <Input id="companyLogoUrl" type="url" placeholder="https://example.com/logo.png" value={companyLogoUrl} onChange={(e) => setCompanyLogoUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industrySector">Sector/Industry Domain</Label>
                <Input id="industrySector" type="text" placeholder="e.g., IT, Manufacturing, Healthcare" value={industrySector} onChange={(e) => setIndustrySector(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillsSeeking">Skills Seeking in Candidates</Label>
                <Textarea id="skillsSeeking" placeholder="e.g., React, Python, Data Analysis, Project Management" value={skillsSeeking} onChange={(e) => setSkillsSeeking(e.target.value)} required />
                 <p className="text-xs text-muted-foreground">Enter skills separated by commas.</p>
              </div>
            </>
          )}

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup}>
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={selectedRole ? `/login?role=${selectedRole}` : "/role-select"} className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
          <Button variant="link" onClick={() => router.push('/role-select')} className="text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
