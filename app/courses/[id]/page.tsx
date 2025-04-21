import Link from 'next/link';
import { getCourseById } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

// Add this function to lib/actions.ts
// export async function getCourseById(id: number) {
//   try {
//     return await db.query.courses.findFirst({
//       where: eq(courses.id, id),
//       with: {
//         department: true,
//         faculty: true,
//         enrollments: {
//           with: {
//             student: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching course:', error);
//     throw new Error('Failed to fetch course');
//   }
// }

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id);
  const course = await getCourseById(courseId);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Link href="/courses">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/courses">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Course Details</h1>
        </div>
        <Link href={`/courses/${courseId}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Course Code</p>
                <p className="font-medium">{course.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course Name</p>
                <p className="font-medium">{course.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="font-medium">{course.credits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {course.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{course.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department & Faculty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{course.department?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faculty</p>
              <p className="font-medium">
                {course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : 'Not Assigned'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          {course.enrollments && course.enrollments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.enrollments.map((enrollment: { id: Key | null | undefined; student: { id: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; firstName: any; lastName: any; }; semester: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; year: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; grade: any; }) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.student.id}</TableCell>
                    <TableCell>{`${enrollment.student.firstName} ${enrollment.student.lastName}`}</TableCell>
                    <TableCell>{enrollment.semester}</TableCell>
                    <TableCell>{enrollment.year}</TableCell>
                    <TableCell>{enrollment.grade || 'Not Graded'}</TableCell>
                    <TableCell>
                      <Link href={`/marks/add?enrollmentId=${enrollment.id}`}>
                        <Button variant="outline" size="sm">Add Marks</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No students enrolled</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
