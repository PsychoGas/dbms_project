'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDepartmentById, getFaculties, assignFacultyToDepartment } from '@/lib/actions';
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
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  facultyId: z.string({
    required_error: "Please select a faculty member",
  }),
});

export default function AssignFacultyPage({ params }: { params: { id: string } }) {
  const departmentId = parseInt(params.id);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [department, setDepartment] = useState<any>(null);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentData, facultiesData] = await Promise.all([
          getDepartmentById(departmentId),
          getFaculties(),
        ]);
        setDepartment(departmentData);

        // Filter out faculties that are already in this department
        const availableFaculties = facultiesData.filter((faculty: any) =>
          faculty.departmentId !== departmentId
        );

        setFaculties(availableFaculties);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [departmentId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyId: '',
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      await assignFacultyToDepartment(parseInt(values.facultyId), departmentId);
      router.push(`/departments/${departmentId}`);
      router.refresh();
    } catch (error) {
      console.error('Error assigning faculty:', error);
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

  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
        <Link href="/departments">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href={`/departments/${departmentId}`}>
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Assign Faculty to {department.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign Faculty to Department</CardTitle>
          <CardDescription>
            Select a faculty member to assign to the {department.name} department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {faculties.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No available faculty members to assign.</p>
              <Link href="/faculties/add">
                <Button className="mt-2">
                  Add New Faculty
                </Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="facultyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty Member</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a faculty member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {faculties.map((faculty: any) => (
                            <SelectItem
                              key={faculty.id}
                              value={faculty.id.toString()}
                            >
                              {`${faculty.firstName} ${faculty.lastName}`}
                              {faculty.designation ? ` - ${faculty.designation}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    {isSubmitting ? 'Assigning...' : 'Assign Faculty'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
