
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, Suspense } from "react";

function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setIsClient(true);
    const roleFromQuery = searchParams.get('role');
    setRole(roleFromQuery);
  }, [searchParams]);

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate form validation and successful login
    if (isClient) {
      localStorage.setItem('isLoggedIn', 'true');
      const userRoleToStore = role || "student"; // Default to student if no role in query
      localStorage.setItem('userRole', userRoleToStore);
      // Simulate storing a generic username if not already set
      if (!localStorage.getItem('userName')) {
        localStorage.setItem('userName', email.split('@')[0] || "User");
      }
      
      toast({
        title: "Login Successful!",
        description: "Redirecting you to your portal...",
      });

      switch (userRoleToStore) {
        case "student":
          router.push("/portfolio");
          break;
        case "industry":
          router.push("/jobs"); // Or industry dashboard
          break;
        case "polytechnic":
          router.push("/admin-dashboard");
          break;
        default:
          router.push("/select-portal"); // Fallback if role is unknown or not set
      }
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
            Login to {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Portal` : "Kaushalya Setu"}
          </CardTitle>
          <CardDescription>Access your Kaushalya Setu account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href={role ? `/signup?role=${role}` : "/role-select"} className="font-semibold text-primary hover:underline">
              Sign Up
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  )
}
