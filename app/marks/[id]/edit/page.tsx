'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMarkById, updateMarks, deleteMarks } from '@/lib/actions';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
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

export default function EditMarksPage({ params }: { params: { id: string } }) {
  const markId = parseInt(params.id);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mark, setMark] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: '',
      score: 0,
      maxScore: 100,
      remarks: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const markData = await getMarkById(markId);
        setMark(markData);

        if (markData) {
          form.reset({
            examType: markData.examType,
            score: Number(markData.score),
            maxScore: Number(markData.maxScore),
            remarks: markData.remarks || '',
          });
        }
      } catch (error) {
        console.error('Error fetching mark:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [markId, form]);

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      await updateMarks(markId, {
        examType: values.examType,
        score: values.score,
        maxScore: values.maxScore,
        remarks: values.remarks,
      });
      router.push('/marks');
      router.refresh();
    } catch (error) {
      console.error('Error updating marks:', error);
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteMarks(markId);
      router.push('/marks');
      router.refresh();
    } catch (error) {
      console.error('Error deleting marks:', error);
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!mark) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Mark Record Not Found</h1>
        <Link href="/marks">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marks
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/marks">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Mark Record</h1>
          </div>
<AlertDialog>
<AlertDialogTrigger asChild>
<Button variant="destructive" size="sm">
<Trash className="h-4 w-4 mr-1" />
Delete
</Button>
</AlertDialogTrigger>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Are you sure?</AlertDialogTitle>
<AlertDialogDescription>
This action cannot be undone. This will permanently delete the mark record.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel>Cancel</AlertDialogCancel>
<AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
{isDeleting ? 'Deleting...' : 'Delete'}
</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
</div>
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Mark Details</CardTitle>
      <CardDescription>
        Viewing mark for {mark.enrollment.student.firstName} {mark.enrollment.student.lastName} in {mark.enrollment.course.name}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Student</p>
          <p className="font-medium">{mark.enrollment.student.firstName} {mark.enrollment.student.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Course</p>
          <p className="font-medium">{mark.enrollment.course.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Score</p>
          <p className="font-medium">{mark.score} / {mark.maxScore}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Percentage</p>
          {(() => {
            const percentage = Math.round((mark.score / mark.maxScore) * 100);
            const gradeColor =
              percentage >= 90 ? "bg-green-100 text-green-800" :
              percentage >= 70 ? "bg-blue-100 text-blue-800" :
              percentage >= 50 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800";

            return (
              <span className={`px-2 py-1 rounded-full text-xs ${gradeColor}`}>
                {percentage}%
              </span>
            );
          })()}
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Edit Mark Record</CardTitle>
      <CardDescription>
        Update the mark details for this student's exam.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {isSubmitting ? 'Saving...' : 'Update Marks'}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>
);
}
