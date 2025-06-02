
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignup = () => {
    if (!selectedRole) {
      toast({
        title: "Role not selected",
        description: "Please select your role to complete signup.",
        variant: "destructive",
      });
      return;
    }

    if (isClient) {
      localStorage.setItem('isLoggedIn', 'true');
    }

    toast({
      title: "Signup Successful!",
      description: `Welcome! Redirecting you to the ${selectedRole} portal...`,
    });

    if (selectedRole === "student") {
      router.push("/portfolio");
    } else if (selectedRole === "industry") {
      router.push("/jobs");
    } else if (selectedRole === "polytechnic") {
      router.push("/admin-dashboard");
    } else {
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
          <CardTitle className="text-2xl font-bold font-headline">Create Your Account</CardTitle>
          <CardDescription>Join Kaushalya Setu and start building your future.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" placeholder="Your full name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup}>
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
