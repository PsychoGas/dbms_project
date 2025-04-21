import Link from 'next/link';
import { getStudents } from '@/lib/actions';
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

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Link href="/students/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No students found. Add a student to get started.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/students/${student.id}`}>
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
