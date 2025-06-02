
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageStudentsAdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Manage Students
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-body">
            This page will contain tools and lists for approving, managing, and viewing student accounts
            registered under this polytechnic institution.
          </p>
          <p className="text-muted-foreground font-body mt-2">
            Functionality such as approving/rejecting pending accounts, viewing student details,
            and downloading student data (CSV) will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
