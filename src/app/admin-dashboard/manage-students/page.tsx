
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, ArrowLeft, CheckCircle2, XCircle, Edit3, Mail, Download, MoreVertical, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  fullName: string;
  email: string;
  courseStream: string;
  registrationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  institutionId: string; // To simulate filtering by admin's institution
}

// Dummy data - in a real app, this would come from Firebase
const allStudents: Student[] = [
  { id: 's1', fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', courseStream: 'Computer Science', registrationDate: new Date(2023, 10, 15), status: 'pending', institutionId: 'poly123' },
  { id: 's2', fullName: 'Priya Patel', email: 'priya.patel@example.com', courseStream: 'Electronics Engineering', registrationDate: new Date(2023, 9, 20), status: 'approved', institutionId: 'poly123' },
  { id: 's3', fullName: 'Rohan Das', email: 'rohan.das@example.com', courseStream: 'Mechanical Engineering', registrationDate: new Date(2023, 11, 1), status: 'pending', institutionId: 'poly123' },
  { id: 's4', fullName: 'Sneha Reddy', email: 'sneha.reddy@example.com', courseStream: 'Information Technology', registrationDate: new Date(2023, 8, 5), status: 'rejected', institutionId: 'poly123' },
  { id: 's5', fullName: 'Vikram Singh', email: 'vikram.singh@example.com', courseStream: 'Civil Engineering', registrationDate: new Date(2023, 10, 25), status: 'approved', institutionId: 'poly123' },
  { id: 's6', fullName: 'Anjali Mehta', email: 'anjali.mehta@example.com', courseStream: 'Computer Science', registrationDate: new Date(2024, 0, 10), status: 'pending', institutionId: 'poly123' },
  { id: 's7', fullName: 'Mohammed Khan', email: 'mohammed.khan@example.com', courseStream: 'Electrical Engineering', registrationDate: new Date(2023, 7, 12), status: 'approved', institutionId: 'polyOther' }, // Different institution
  { id: 's8', fullName: 'Deepika Iyer', email: 'deepika.iyer@example.com', courseStream: 'Biotechnology', registrationDate: new Date(2024, 1, 5), status: 'pending', institutionId: 'poly123' },
];

// Simulate current admin's institution
const ADMIN_INSTITUTION_ID = 'poly123';

export default function ManageStudentsAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [studentToReject, setStudentToReject] = useState<Student | null>(null);

  useEffect(() => {
    // Simulate fetching students for the admin's institution
    setStudents(allStudents.filter(s => s.institutionId === ADMIN_INSTITUTION_ID));
  }, []);

  const filteredStudents = useMemo(() => {
    if (filterStatus === 'all') {
      return students;
    }
    return students.filter(student => student.status === filterStatus);
  }, [students, filterStatus]);

  const handleApprove = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'approved' } : s));
    const student = students.find(s => s.id === studentId);
    toast({ title: "Student Approved", description: `${student?.fullName || 'Student'} has been approved.` });
  };

  const openRejectDialog = (student: Student) => {
    setStudentToReject(student);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!studentToReject) return;
    setStudents(prev => prev.map(s => s.id === studentToReject.id ? { ...s, status: 'rejected' } : s));
    toast({ title: "Student Rejected", description: `${studentToReject.fullName} has been rejected.`, variant: "destructive" });
    setIsRejectDialogOpen(false);
    setStudentToReject(null);
  };

  const handleRequestEdit = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    toast({ title: "Action Placeholder", description: `Edit request for ${student?.fullName || 'student'} would be initiated here.` });
  };
  
  const handleResendVerification = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    toast({ title: "Action Placeholder", description: `Verification email resend for ${student?.fullName || 'student'} would be initiated here.` });
  };

  const handleDownloadCSV = () => {
    toast({ title: "Download Initiated", description: "Student data CSV generation has started." });
    // In a real app, you'd generate and download a CSV file here
  };

  const getStatusBadgeVariant = (status: Student['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved': return 'default'; // Primary color (often green-ish by theme)
      case 'pending': return 'secondary'; // Muted color
      case 'rejected': return 'destructive'; // Red color
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Manage Student Accounts
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>View, approve, and manage student accounts for your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDownloadCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Student Data (CSV)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Course/Stream</TableHead>
                  <TableHead className="hidden lg:table-cell">Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{student.courseStream}</TableCell>
                    <TableCell className="hidden lg:table-cell">{format(student.registrationDate, 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(student.status)} className={cn(
                        student.status === 'approved' && 'bg-green-500/20 text-green-700 border-green-500/50',
                        student.status === 'pending' && 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
                        student.status === 'rejected' && 'bg-red-500/20 text-red-700 border-red-500/50'
                      )}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {student.status !== 'approved' && (
                            <DropdownMenuItem onClick={() => handleApprove(student.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Approve
                            </DropdownMenuItem>
                          )}
                          {student.status !== 'rejected' && (
                            <DropdownMenuItem onClick={() => openRejectDialog(student)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleRequestEdit(student.id)}>
                            <Edit3 className="mr-2 h-4 w-4 text-blue-600" /> Request Edit
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleResendVerification(student.id)}>
                            <Mail className="mr-2 h-4 w-4 text-gray-600" /> Resend Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No students found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reject this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark <span className="font-semibold">{studentToReject?.fullName}</span> as rejected.
              This can be undone later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToReject(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectConfirm} className={buttonVariants({variant: "destructive"})}>
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

    