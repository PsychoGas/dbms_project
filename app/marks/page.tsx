import Link from 'next/link';
import { getMarks } from '@/lib/actions';
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

// Add this function to lib/actions.ts
// export async function getMarks() {
//   try {
//     return await db.query.marks.findMany({
//       with: {
//         enrollment: {
//           with: {
//             student: true,
//             course: true,
//           },
//         },
//       },
//       orderBy: (marks, { desc }) => [desc(marks.createdAt)],
//     });
//   } catch (error) {
//     console.error('Error fetching marks:', error);
//     throw new Error('Failed to fetch marks');
//   }
// }

export default async function MarksPage() {
  const marks = await getMarks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Marks</h1>
        <Link href="/marks/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Marks
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Exam Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Max Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No marks found. Add marks to get started.
                </TableCell>
              </TableRow>
            ) : (
              marks.map((mark :any) => (
                <TableRow key={mark.id}>
                  <TableCell>{mark.id}</TableCell>
                  <TableCell>
                    {`${mark.enrollment.student.firstName} ${mark.enrollment.student.lastName}`}
                  </TableCell>
                  <TableCell>{mark.enrollment.course.name}</TableCell>
                  <TableCell>{mark.examType}</TableCell>
                  <TableCell>{mark.score}</TableCell>
                  <TableCell>{mark.maxScore}</TableCell>
                  <TableCell>
                    {`${((Number(mark.score) / Number(mark.maxScore)) * 100).toFixed(2)}%`}
                  </TableCell>
                  <TableCell>
                    {new Date(mark.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/marks/${mark.id}`}>
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
