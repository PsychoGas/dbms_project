import Link from 'next/link';
import { getDepartments } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, UserPlus } from 'lucide-react';

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departments</h1>
        <Link href="/departments/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Faculty Count</TableHead>
              <TableHead>Course Count</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No departments found. Add a department to get started.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department: any) => (
                <TableRow key={department.id}>
                  <TableCell>{department.id}</TableCell>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.code}</TableCell>
                  <TableCell>{department.faculties?.length || 0}</TableCell>
                  <TableCell>{department.courses?.length || 0}</TableCell>
                  <TableCell>
                    {new Date(department.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Link href={`/departments/${department.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/departments/${department.id}/assign-faculty`}>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign Faculty
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
