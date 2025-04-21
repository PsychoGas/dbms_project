import Link from 'next/link';
import { getAttendance } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, FileDown, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AttendancePage() {
  const attendanceRecords = await getAttendance();

  // Calculate attendance statistics
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(record => record.isPresent).length;
  const absentCount = totalRecords - presentCount;
  const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords * 100).toFixed(1) : '0';

  // Group attendance by date
  const attendanceByDate = attendanceRecords.reduce((acc: any, record: any) => {
    const date = new Date(record.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { total: 0, present: 0 };
    }
    acc[date].total += 1;
    if (record.isPresent) {
      acc[date].present += 1;
    }
    return acc;
  }, {});

  // Convert to array and sort by date (newest first)
  const attendanceDates = Object.entries(attendanceByDate)
    .map(([date, stats]: [string, any]) => ({
      date,
      total: stats.total,
      present: stats.present,
      rate: ((stats.present / stats.total) * 100).toFixed(1)
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance Records</h1>
        <div className="flex space-x-2">
          <Link href="/attendance/report">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/attendance/mark">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Mark Attendance
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
            <div className="text-2xl font-bold">{totalRecords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {presentCount} present, {absentCount} absent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Recorded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceRecords.length > 0
                ? new Date(attendanceRecords[0].date).toLocaleDateString()
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">All Records</TabsTrigger>
          <TabsTrigger value="by-date">By Date</TabsTrigger>
        </TabsList>
        <TabsContent value="records" className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance Records</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No attendance records found. Mark attendance to get started.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceRecords.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {`${record.enrollment.student.firstName} ${record.enrollment.student.lastName}`}
                    </TableCell>
                    <TableCell>{record.enrollment.course.name}</TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${record.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </TableCell>
                    <TableCell>{record.remarks || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/attendance/${record.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/attendance/${record.id}`}>
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
        <TabsContent value="by-date" className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance by Date</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Records</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceDates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceDates.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>{item.present}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parseFloat(item.rate) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(item.rate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.rate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/attendance/date/${encodeURIComponent(item.date)}`}>
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
