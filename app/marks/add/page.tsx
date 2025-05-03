'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addMarks, getEnrollments } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  enrollmentId: z.string({
    required_error: "Please select a student and course",
  }),
  examType: z.string().min(2, {
    message: 'Exam type must be at least 2 characters.',
  }),
  score: z.coerce.number().min(0, {
    message: 'Score must be at least 0.',
  }),
  maxScore: z.coerce.number().min(1, {
    message: 'Maximum score must be at least 1.',
  }),
  remarks: z.string().optional(),
});

export function AddMarksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentIdParam = searchParams.get('enrollmentId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsData = await getEnrollments();
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enrollmentId: enrollmentIdParam || '',
      examType: '',
      score: 0,
      maxScore: 100,
      remarks: '',
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      await addMarks({
        enrollmentId: parseInt(values.enrollmentId),
        examType: values.examType,
        score: values.score,
        maxScore: values.maxScore,
        remarks: values.remarks,
      });
      router.push('/marks');
      router.refresh();
    } catch (error) {
      console.error('Error adding marks:', error);
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/marks">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Student Marks</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Exam Marks</CardTitle>
          <CardDescription>
            Enter the exam details and scores for a student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student & Course</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student and course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enrollments.map((enrollment: any) => (
                          <SelectItem
                            key={enrollment.id}
                            value={enrollment.id.toString()}
                          >
                            {`${enrollment.student.firstName} ${enrollment.student.lastName} - ${enrollment.course.name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Midterm, Final, Assignment, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Score</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional comments about the student's performance"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Marks'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MainPage() {
    return (
        <Suspense>
            <AddMarksPage />
        </Suspense>
    )
}
