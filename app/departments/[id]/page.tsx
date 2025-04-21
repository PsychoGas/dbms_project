import Link from 'next/link';
import { getDepartmentById } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const departmentId = parseInt(params.id);
  const department = await getDepartmentById(departmentId);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/departments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Department Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/departments/${departmentId}/assign-faculty`}>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Faculty
            </Button>
          </Link>
          <Link href={`/departments/${departmentId}/edit`}>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Department
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Department Name</p>
              <p className="font-medium">{department.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department Code</p>
              <p className="font-medium">{department.code}</p>
            </div>
          </div>
          {department.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{department.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Faculty Members</CardTitle>
            <Link href={`/departments/${departmentId}/assign-faculty`}>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {department.faculties && department.faculties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.faculties.map((faculty: any) => (
                    <TableRow key={faculty.id}>
                      <TableCell>{faculty.id}</TableCell>
                      <TableCell>{`${faculty.firstName} ${faculty.lastName}`}</TableCell>
                      <TableCell>{faculty.designation || 'N/A'}</TableCell>
                      <TableCell>
                        <Link href={`/faculties/${faculty.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No faculty members in this department</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {department.courses && department.courses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.courses.map((course: any) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No courses in this department</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
