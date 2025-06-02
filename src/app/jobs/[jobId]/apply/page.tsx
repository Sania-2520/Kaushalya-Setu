
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Briefcase, Loader2, FileText, UploadCloud, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF and DOCX

const applicationSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  company: z.string().optional(),
  applicantName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  applicantEmail: z.string().email({ message: "Invalid email address." }),
  applicantPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  coverLetter: z.string().min(20, { message: "Cover letter must be at least 20 characters." }).max(2000, "Cover letter cannot exceed 2000 characters."),
  resume: z.custom<FileList>()
    .refine(files => files && files.length === 1, "Resume is required.")
    .refine(files => files && files?.[0]?.size <= MAX_FILE_SIZE_BYTES, `Resume must be ${MAX_FILE_SIZE_MB}MB or less.`)
    .refine(files => files && ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Resume must be a PDF or DOCX file."),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobDetails {
    title: string;
    company: string;
}

function JobApplicationForm() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { toast } = useToast();

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        setIsLoadingJob(true);
        try {
          const jobDocRef = doc(db, 'jobs', jobId);
          const jobDocSnap = await getDoc(jobDocRef);
          if (jobDocSnap.exists()) {
            const jobData = jobDocSnap.data();
            const details = {
                title: jobData.title || "N/A",
                company: jobData.company || "N/A"
            };
            setJobDetails(details);
            setValue('jobId', jobId);
            setValue('jobTitle', details.title);
            setValue('company', details.company);
          } else {
            toast({ title: "Error", description: "Job not found.", variant: "destructive" });
            setJobDetails(null); // Explicitly set to null if not found
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          toast({ title: "Error", description: "Could not load job details.", variant: "destructive" });
           setJobDetails(null);
        } finally {
          setIsLoadingJob(false);
        }
      };
      fetchJobDetails();
    }
  }, [jobId, toast, setValue]);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    const resumeFile = data.resume[0];
    const uniqueFileName = `${Date.now()}_${resumeFile.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `resumes/${jobId}/${uniqueFileName}`);
    
    try {
      const uploadTask = uploadBytesResumable(storageRef, resumeFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          toast({ title: "Resume Upload Failed", description: error.message, variant: "destructive" });
          setIsSubmitting(false);
          setUploadProgress(0);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, 'applications'), {
            jobId: data.jobId,
            jobTitle: data.jobTitle,
            company: data.company,
            applicantName: data.applicantName,
            applicantEmail: data.applicantEmail,
            applicantPhone: data.applicantPhone,
            coverLetter: data.coverLetter,
            resumeUrl: downloadURL,
            resumeFileName: resumeFile.name,
            appliedDate: serverTimestamp(),
            status: "Submitted",
          });

          toast({ title: "Application Submitted!", description: "Your application has been sent successfully." });
          reset();
          setSelectedFileName(null);
          router.push(`/jobs/application-submitted?jobTitle=${encodeURIComponent(data.jobTitle)}&company=${encodeURIComponent(data.company || 'the company')}`);
        }
      );
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({ title: "Submission Failed", description: "Could not submit your application.", variant: "destructive" });
      setIsSubmitting(false);
      setUploadProgress(0);
    }
    // setIsSubmitting will be set to false within the uploadTask's error/complete callbacks
  };


  if (isLoadingJob) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
            The job you are trying to apply for could not be found. It might have been removed or the link is incorrect.
        </p>
        <Button asChild><Link href="/jobs">Back to Job Listings</Link></Button>
    </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl font-bold font-headline">Apply for: {jobDetails.title}</CardTitle>
                <CardDescription>at {jobDetails.company}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="applicantName">Full Name*</Label>
                <Input id="applicantName" {...register("applicantName")} placeholder="Your full name" className={errors.applicantName ? "border-destructive" : ""} />
                {errors.applicantName && <p className="text-xs text-destructive mt-1">{errors.applicantName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="applicantEmail">Email Address*</Label>
                <Input id="applicantEmail" type="email" {...register("applicantEmail")} placeholder="you@example.com" className={errors.applicantEmail ? "border-destructive" : ""} />
                {errors.applicantEmail && <p className="text-xs text-destructive mt-1">{errors.applicantEmail.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="applicantPhone">Phone Number*</Label>
              <Input id="applicantPhone" type="tel" {...register("applicantPhone")} placeholder="+91 XXXXX XXXXX" className={errors.applicantPhone ? "border-destructive" : ""} />
              {errors.applicantPhone && <p className="text-xs text-destructive mt-1">{errors.applicantPhone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="coverLetter">Cover Letter / About You*</Label>
              <Textarea id="coverLetter" {...register("coverLetter")} placeholder="Tell us why you're a great fit..." className={`min-h-[120px] ${errors.coverLetter ? "border-destructive" : ""}`} />
              {errors.coverLetter && <p className="text-xs text-destructive mt-1">{errors.coverLetter.message}</p>}
            </div>
             <div className="space-y-1">
              <Label htmlFor="resume">Upload Resume* <span className="text-xs text-muted-foreground">(PDF or DOCX, Max {MAX_FILE_SIZE_MB}MB)</span></Label>
              <Controller
                name="resume"
                control={control}
                render={({ field: { onChange, onBlur, name, ref } }) => (
                    <>
                    <Button type="button" variant="outline" className={`w-full justify-start font-normal ${errors.resume ? "border-destructive" : ""}`} onClick={() => document.getElementById('resume-input')?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {selectedFileName || "Choose your resume file..."}
                    </Button>
                    <Input 
                        id="resume-input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx"
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                        onChange={(e) => {
                            onChange(e.target.files);
                            setSelectedFileName(e.target.files?.[0]?.name || null);
                        }}
                    />
                    </>
                )}
                />
              {errors.resume && <p className="text-xs text-destructive mt-1">{errors.resume.message as string}</p>}
            </div>

            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-1">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}%</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}


export default function JobApplicationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>}>
            <JobApplicationForm />
        </Suspense>
    )
}

    