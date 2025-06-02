
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { Briefcase, FileText, Loader2, User, Mail, Phone, Send, UploadCloud } from 'lucide-react';
import Link from 'next/link';

const applicationSchema = z.object({
  applicantName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  applicantEmail: z.string().email({ message: "Invalid email address." }),
  applicantPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
  coverLetter: z.string().min(20, { message: "Cover letter must be at least 20 characters." }).max(2000, {message: "Cover letter must be less than 2000 characters."}),
  resume: z.custom<FileList>((val) => val instanceof FileList && val.length > 0, "Resume is required.")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Resume size should be less than 5MB.`)
    .refine(
      (files) => files?.[0]?.type === "application/pdf" || 
                 files?.[0]?.type === "application/msword" || 
                 files?.[0]?.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Only .pdf, .doc, .docx formats are supported."
    ),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobDetails {
  id: string;
  title: string;
  company: string;
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const { toast } = useToast();

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);


  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });
  const resumeFile = watch("resume");

  useEffect(() => {
    if (resumeFile && resumeFile.length > 0) {
      setFileName(resumeFile[0].name);
    } else {
      setFileName(null);
    }
  }, [resumeFile]);


  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        setIsLoadingJob(true);
        try {
          const jobDocRef = doc(db, 'jobs', jobId);
          const jobSnap = await getDoc(jobDocRef);
          if (jobSnap.exists()) {
            const jobData = jobSnap.data();
            setJobDetails({
              id: jobSnap.id,
              title: jobData.title,
              company: jobData.company,
            });
          } else {
            toast({ title: "Error", description: "Job not found.", variant: "destructive" });
            router.push('/jobs');
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          toast({ title: "Error", description: "Could not load job details.", variant: "destructive" });
          router.push('/jobs');
        } finally {
          setIsLoadingJob(false);
        }
      };
      fetchJobDetails();
    }
  }, [jobId, router, toast]);

  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    if (!jobDetails) {
      toast({ title: "Error", description: "Job details not loaded.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);

    const file = data.resume[0];
    const storageRef = ref(storage, `resumes/${jobId}/${Date.now()}_${file.name}`);
    
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload failed:", error);
          toast({ title: "Upload Error", description: "Failed to upload resume. Please try again.", variant: "destructive" });
          setIsSubmitting(false);
          setUploadProgress(null);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const applicationData = {
            jobId: jobDetails.id,
            jobTitle: jobDetails.title, // Denormalized
            companyName: jobDetails.company, // Denormalized
            applicantName: data.applicantName,
            applicantEmail: data.applicantEmail,
            applicantPhone: data.applicantPhone,
            coverLetter: data.coverLetter,
            resumeUrl: downloadURL,
            resumeFileName: file.name,
            appliedDate: serverTimestamp() as Timestamp,
            status: "Submitted",
          };

          const docRef = await addDoc(collection(db, 'applications'), applicationData);
          
          toast({ title: "Application Submitted!", description: "Your application has been successfully submitted." });
          reset();
          setFileName(null);
          setUploadProgress(null);
          router.push(`/jobs/application-submitted?jobTitle=${encodeURIComponent(jobDetails.title)}&company=${encodeURIComponent(jobDetails.company)}`);
        }
      );
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({ title: "Submission Error", description: "Could not submit application. Please try again.", variant: "destructive" });
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg font-semibold">Loading job details...</p>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
          <Briefcase className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you are trying to apply for could not be found.</p>
          <Button asChild><Link href="/jobs">Back to Jobs</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline text-primary">Apply for: {jobDetails.title}</CardTitle>
          <CardDescription>Company: {jobDetails.company}<br/>Job ID: {jobDetails.id}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="applicantName" className="flex items-center"><User className="mr-2 h-4 w-4 text-primary" />Full Name</Label>
              <Input id="applicantName" {...register("applicantName")} placeholder="Your full name" />
              {errors.applicantName && <p className="text-sm text-destructive">{errors.applicantName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantEmail" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-primary" />Email Address</Label>
              <Input id="applicantEmail" type="email" {...register("applicantEmail")} placeholder="you@example.com" />
              {errors.applicantEmail && <p className="text-sm text-destructive">{errors.applicantEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantPhone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-primary" />Phone Number</Label>
              <Input id="applicantPhone" type="tel" {...register("applicantPhone")} placeholder="+91 XXXXX XXXXX" />
              {errors.applicantPhone && <p className="text-sm text-destructive">{errors.applicantPhone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume" className="flex items-center"><FileText className="mr-2 h-4 w-4 text-primary" />Resume (PDF, DOC, DOCX - Max 5MB)</Label>
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById('resume-input')?.click()} className="w-auto">
                    <UploadCloud className="mr-2 h-4 w-4" /> Choose File
                </Button>
                <Input 
                    id="resume-input" // Hidden input
                    type="file" 
                    className="hidden"
                    {...register("resume")} 
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                 />
                 {fileName && <span className="text-sm text-muted-foreground truncate max-w-xs">{fileName}</span>}
              </div>
              {errors.resume && <p className="text-sm text-destructive mt-1">{errors.resume.message as string}</p>}
              {uploadProgress !== null && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(uploadProgress)}% uploaded</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-primary" />Cover Letter / About you</Label>
              <Textarea id="coverLetter" {...register("coverLetter")} placeholder="Tell us about yourself and why you're interested in this role..." className="min-h-[150px]" />
              {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (uploadProgress !== null && uploadProgress < 100)}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? (uploadProgress !== null ? `Uploading ${Math.round(uploadProgress)}%` : 'Submitting...') : 'Submit Application'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
