
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { useToast } from "@/hooks/use-toast";

function SignupComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [polytechnicName, setPolytechnicName] = useState<string>(""); // Used for both student's polytechnic and admin's institution
  const [courseDepartment, setCourseDepartment] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  
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
    if (!fullName || !email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
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
    if (selectedRole === "student" && (!polytechnicName || !courseDepartment || !semester)) {
      toast({ title: "Student Info Missing", description: "Polytechnic name, course, and semester are required for students.", variant: "destructive" });
      return;
    }
    if (selectedRole === "polytechnic" && !polytechnicName.trim()) {
      toast({ title: "Institution Info Missing", description: "Polytechnic Institution Name is required for admins.", variant: "destructive" });
      return;
    }

    if (isClient) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userName', fullName);
      if (selectedRole === 'student' || selectedRole === 'polytechnic') {
        localStorage.setItem('polytechnicName', polytechnicName);
      }
    }

    toast({
      title: "Signup Successful!",
      description: `Welcome, ${fullName}! Redirecting you...`,
    });

    switch (selectedRole) {
      case "student":
        router.push("/portfolio");
        break;
      case "industry":
        router.push("/jobs");
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
      <Card className="w-full max-w-md shadow-xl">
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
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
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

          {selectedRole === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="studentPolytechnicName">Polytechnic Name</Label>
                <Input id="studentPolytechnicName" type="text" placeholder="Your polytechnic" value={polytechnicName} onChange={(e) => setPolytechnicName(e.target.value)} required />
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

          {selectedRole === 'polytechnic' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="adminPolytechnicName">Polytechnic Institution Name</Label>
                <Input id="adminPolytechnicName" type="text" placeholder="Name of your polytechnic institution" value={polytechnicName} onChange={(e) => setPolytechnicName(e.target.value)} required />
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupComponent />
    </Suspense>
  )
}
