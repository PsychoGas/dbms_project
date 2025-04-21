'use client';
import { enrollStudent } from '@/lib/actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addCourse, getDepartments, getFaculties, getStudents } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { any, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterEnum } from '@/lib/schema';
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  code: z.string().min(2, {
    message: 'Course code must be at least 2 characters.',
  }),
  name: z.string().min(3, {
    message: 'Course name must be at least 3 characters.',
  }),
  description: z.string().optional(),
  credits: z.coerce.number().min(1, {
    message: 'Credits must be at least 1.',
  }),
  departmentId: z.coerce.number().optional(),
  facultyId: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
  selectedStudents: z.array(z.number()).optional(),
  semester: z.enum(semesterEnum.enumValues),
  year: z.coerce.number().min(2000).max(2100),
});

export default function AddCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);

                {/* @ts-ignore */}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      credits: 3,
      isActive: true,
      selectedStudents: [],
      semester: 'Fall',
      year: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptData = await getDepartments();
                {/* @ts-ignore */}
        setDepartments(deptData);

        const facultyData = await getFaculties();
                {/* @ts-ignore */}
        setFaculties(facultyData);

        const studentData = await getStudents();
                {/* @ts-ignore */}
        setStudents(studentData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // First create the course
      const courseResult = await addCourse({
        code: values.code,
        name: values.name,
        description: values.description,
        credits: values.credits,
        departmentId: values.departmentId,
        facultyId: values.facultyId,
        isActive: values.isActive,
      });

      // If there are selected students, enroll them in the course
      if (values.selectedStudents && values.selectedStudents.length > 0) {
        await Promise.all(
          values.selectedStudents.map(async (studentId) => {
            try {
              await enrollStudent({
                studentId,
                courseId: courseResult.id,
                semester: values.semester,
                year: values.year,
              });
            } catch (err) {
              console.error(`Error enrolling student ${studentId}:`, err);
            }
          })
        );
      }

      router.push('/courses');
      router.refresh();
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>
            Enter course details and optionally enroll students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of the course"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="credits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credits</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="facultyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id.toString()}>
                            {faculty.firstName} {faculty.lastName}
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        This course is currently active and open for enrollment
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {semesterEnum.enumValues.map((semester) => (
                            <SelectItem key={semester} value={semester}>
                              {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* @ts-ignore */}
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" min={2000} max={2100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="selectedStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enroll Students</FormLabel>
                    <ScrollArea className="h-72 border rounded-md p-4">
                      <div className="space-y-2">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`student-${student.id}`}
                              checked={field.value?.includes(student.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([...currentValues, student.id])
                                  : field.onChange(currentValues.filter((id) => id !== student.id));
                              }}
                            />
                            <label
                              htmlFor={`student-${student.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {student.firstName} {student.lastName} - {student.email}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
                  {isSubmitting ? 'Saving...' : 'Save Course'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
