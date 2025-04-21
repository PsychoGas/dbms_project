import Link from 'next/link';
import { getFaculties } from '@/lib/actions';
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

export default async function FacultiesPage() {
  const faculties = await getFaculties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faculty Members</h1>
        <Link href="/faculties/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Faculty
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
              <TableHead>Designation</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No faculty members found. Add a faculty member to get started.
                </TableCell>
              </TableRow>
            ) : (
              faculties.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell>{faculty.id}</TableCell>
                  <TableCell>
                    {faculty.firstName} {faculty.lastName}
                  </TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.department?.name || 'N/A'}</TableCell>
                  <TableCell>{faculty.designation || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(faculty.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${faculty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {faculty.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/faculties/${faculty.id}`}>
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
