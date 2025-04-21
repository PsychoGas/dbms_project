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
import { PlusCircle, FileDown, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function MarksPage() {
  const marks = await getMarks();

  // Calculate marks statistics
  const totalMarks = marks.length;
  const totalScore = marks.reduce((sum: number, mark: any) => sum + Number(mark.score), 0);
  const totalMaxScore = marks.reduce((sum: number, mark: any) => sum + Number(mark.maxScore), 0);
  const averagePercentage = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(1) : '0';

  // Group marks by exam type
  const marksByExamType = marks.reduce((acc: any, mark: any) => {
    if (!acc[mark.examType]) {
      acc[mark.examType] = { count: 0, totalScore: 0, totalMaxScore: 0 };
    }
    acc[mark.examType].count += 1;
    acc[mark.examType].totalScore += Number(mark.score);
    acc[mark.examType].totalMaxScore += Number(mark.maxScore);
    return acc;
  }, {});

  // Convert to array and calculate percentages
  const examTypes = Object.entries(marksByExamType)
    .map(([type, stats]: [string, any]) => ({
      type,
      count: stats.count,
      averagePercentage: ((stats.totalScore / stats.totalMaxScore) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Marks</h1>
        <div className="flex space-x-2">
          <Link href="/marks/analytics">
            <Button variant="outline">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/marks/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Marks
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMarks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {totalScore} out of {totalMaxScore} points
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Common Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examTypes.length > 0 ? examTypes[0].type : 'N/A'}
            </div>
            {examTypes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {examTypes[0].count} records, {examTypes[0].averagePercentage}% avg
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Marks</TabsTrigger>
          <TabsTrigger value="by-exam">By Exam Type</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Mark Records</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell colSpan={8} className="text-center">
                    No marks found. Add marks to get started.
                  </TableCell>
                </TableRow>
              ) : (
                marks.map((mark: any) => (
                  <TableRow key={mark.id}>
                    <TableCell>
                      {`${mark.enrollment.student.firstName} ${mark.enrollment.student.lastName}`}
                    </TableCell>
                    <TableCell>{mark.enrollment.course.name}</TableCell>
                    <TableCell>{mark.examType}</TableCell>
                    <TableCell>{mark.score}</TableCell>
                    <TableCell>{mark.maxScore}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        (Number(mark.score) / Number(mark.maxScore)) * 100 >= 80 ? 'bg-green-100 text-green-800' :
                        (Number(mark.score) / Number(mark.maxScore)) * 100 >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {((Number(mark.score) / Number(mark.maxScore)) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(mark.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/marks/${mark.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/marks/${mark.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="by-exam" className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Marks by Exam Type</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Type</TableHead>
                <TableHead>Number of Records</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No marks found.
                  </TableCell>
                </TableRow>
              ) : (
                examTypes.map((exam) => (
                  <TableRow key={exam.type}>
                    <TableCell>{exam.type}</TableCell>
                    <TableCell>{exam.count}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parseFloat(exam.averagePercentage) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(exam.averagePercentage) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {exam.averagePercentage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/marks/exam-type/${encodeURIComponent(exam.type)}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
