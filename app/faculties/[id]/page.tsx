import Link from 'next/link';
import { getFacultyById } from '@/lib/actions';
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

// Add this function to lib/actions.ts
// export async function getFacultyById(id: number) {
//   try {
//     return await db.query.faculties.findFirst({
//       where: eq(faculties.id, id),
//       with: {
//         department: true,
//         courses: true,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching faculty:', error);
//     throw new Error('Failed to fetch faculty');
//   }
// }

export default async function FacultyDetailPage({ params }: { params: { id: string } }) {
  const facultyId = parseInt(params.id);
  const faculty = await getFacultyById(facultyId);

  if (!faculty) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Faculty Not Found</h1>
        <Link href="/faculties">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Faculties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/faculties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Faculty Details</h1>
        </div>
        <Link href={`/faculties/${facultyId}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Faculty
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{faculty.firstName} {faculty.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{faculty.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{faculty.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{faculty.designation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-medium">
                  {new Date(faculty.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${faculty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {faculty.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{faculty.department?.name || 'N/A'}</p>
            </div>
            {faculty.department && (
              <div>
                <p className="text-sm text-muted-foreground">Department Code</p>
                <p className="font-medium">{faculty.department.code}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {faculty.courses && faculty.courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.departmentId ? faculty.department?.name : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No courses assigned</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
