import Link from 'next/link';
import { getCourses } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link href="/courses/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No courses found. Add a course to get started.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.department?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {course.faculty ? `${course.faculty.firstName} ${course.faculty.lastName}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
