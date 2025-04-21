'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAttendanceById, updateAttendance, deleteAttendance } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date.',
  }),
  isPresent: z.boolean(),
  remarks: z.string().optional(),
});

export default function EditAttendancePage({ params }: { params: { id: string } }) {
  const attendanceId = parseInt(params.id);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attendance, setAttendance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      isPresent: true,
      remarks: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceData = await getAttendanceById(attendanceId);
        setAttendance(attendanceData);

        if (attendanceData) {
          form.reset({
            date: new Date(attendanceData.date).toISOString().split('T')[0],
            isPresent: attendanceData.isPresent ?? false,
            remarks: attendanceData.remarks || '',
          });
        }
      } catch (error) {
        console.error('Error fetching attendance record:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [attendanceId, form]);

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      await updateAttendance(attendanceId, {
        date: values.date,
        isPresent: values.isPresent,
        remarks: values.remarks,
      });
      router.push('/attendance');
      router.refresh();
    } catch (error) {
      console.error('Error updating attendance:', error);
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteAttendance(attendanceId);
      router.push('/attendance');
      router.refresh();
    } catch (error) {
      console.error('Error deleting attendance:', error);
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

  if (!attendance) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Attendance Record Not Found</h1>
        <Link href="/attendance">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Attendance
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/attendance">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Attendance Record</h1>
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
                This action cannot be undone. This will permanently delete the attendance record.
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

      <Card>
        <CardHeader>
          <CardTitle>Edit Attendance Record</CardTitle>
          <CardDescription>
            Update the attendance record for {attendance.enrollment.student.firstName} {attendance.enrollment.student.lastName} in {attendance.enrollment.course.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="font-medium">Student: {attendance.enrollment.student.firstName} {attendance.enrollment.student.lastName}</p>
                <p className="text-sm text-muted-foreground">Course: {attendance.enrollment.course.name}</p>
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPresent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Present
                      </FormLabel>
                      <FormDescription>
                        Check if the student was present for this class.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any notes about the student's attendance"
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
                  {isSubmitting ? 'Saving...' : 'Update Attendance'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
