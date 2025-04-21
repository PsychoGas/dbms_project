'use server';

import { db } from './db';
import {
  students, faculties, departments, courses, enrollments, marks, attendance,
  semesterEnum, gradeEnum
} from './schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define proper types for database operations
type NewStudent = typeof students.$inferInsert;
type Student = typeof students.$inferSelect;
type NewFaculty = typeof faculties.$inferInsert;
type Faculty = typeof faculties.$inferSelect;
type NewDepartment = typeof departments.$inferInsert;
type Department = typeof departments.$inferSelect;
type NewCourse = typeof courses.$inferInsert;
type Course = typeof courses.$inferSelect;
type NewEnrollment = typeof enrollments.$inferInsert;
type Enrollment = typeof enrollments.$inferSelect;
type NewMark = typeof marks.$inferInsert;
type Mark = typeof marks.$inferSelect;
type NewAttendance = typeof attendance.$inferInsert;
type Attendance = typeof attendance.$inferSelect;

// Helper function to format Date objects for database
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Department Functions
export async function getDepartments() {
  try {
    return await db.query.departments.findMany({
      orderBy: (departments, { asc }) => [asc(departments.name)],
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }
}

export async function addDepartment(data: {
  name: string;
  code: string;
  description?: string;
}) {
  try {
    const departmentData: NewDepartment = {
      name: data.name,
      code: data.code,
      description: data.description,
    };

    const result = await db.insert(departments).values(departmentData).returning();
    revalidatePath('/departments');
    return result[0];
  } catch (error) {
    console.error('Error adding department:', error);
    throw new Error('Failed to add department');
  }
}

export async function updateDepartment(id: number, data: {
  name?: string;
  code?: string;
  description?: string;
}) {
  try {
    const updateData: Partial<NewDepartment> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.description !== undefined) updateData.description = data.description;

    updateData.updatedAt = new Date();

    const result = await db.update(departments)
      .set(updateData)
      .where(eq(departments.id, id))
      .returning();

    revalidatePath('/departments');
    return result[0];
  } catch (error) {
    console.error('Error updating department:', error);
    throw new Error('Failed to update department');
  }
}

// Faculty Functions
export async function getFaculties() {
  try {
    return await db.query.faculties.findMany({
      with: {
        department: true,
      },
      orderBy: (faculties, { asc }) => [asc(faculties.lastName)],
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    throw new Error('Failed to fetch faculties');
  }
}

export async function addFaculty(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: number;
  designation?: string;
  joinDate: Date;
  isActive?: boolean;
}) {
  try {
    const facultyData: NewFaculty = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      departmentId: data.departmentId,
      designation: data.designation,
      joinDate: formatDate(data.joinDate),
      isActive: data.isActive,
    };

    const result = await db.insert(faculties).values(facultyData).returning();
    revalidatePath('/faculties');
    return result[0];
  } catch (error) {
    console.error('Error adding faculty:', error);
    throw new Error('Failed to add faculty');
  }
}

export async function updateFaculty(id: number, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  departmentId?: number;
  designation?: string;
  joinDate?: Date;
  isActive?: boolean;
}) {
  try {
    const updateData: Partial<NewFaculty> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.joinDate !== undefined) updateData.joinDate = formatDate(data.joinDate);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    updateData.updatedAt = new Date();

    const result = await db.update(faculties)
      .set(updateData)
      .where(eq(faculties.id, id))
      .returning();

    revalidatePath('/faculties');
    return result[0];
  } catch (error) {
    console.error('Error updating faculty:', error);
    throw new Error('Failed to update faculty');
  }
}

// Student Functions
export async function getStudents() {
  try {
    return await db.query.students.findMany({
      with: {
        department: true,
      },
      orderBy: (students, { asc }) => [asc(students.lastName)],
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students');
  }
}

export async function getStudentById(id: number) {
  try {
    return await db.query.students.findFirst({
      where: eq(students.id, id),
      with: {
        department: true,
        enrollments: {
          with: {
            course: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    throw new Error('Failed to fetch student');
  }
}

export async function addStudent(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  enrollmentDate: Date;
  departmentId?: number;
  isActive?: boolean;
}) {
  try {
    const studentData: NewStudent = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        departmentId: data.departmentId,
        isActive: data.isActive,
        enrollmentDate: ''
    };

    // Handle dates properly
    if (data.dateOfBirth) {
      studentData.dateOfBirth = formatDate(data.dateOfBirth);
    }

    studentData.enrollmentDate = formatDate(data.enrollmentDate);

    const result = await db.insert(students).values(studentData).returning();
    revalidatePath('/students');
    return result[0];
  } catch (error) {
    console.error('Error adding student:', error);
    throw new Error('Failed to add student');
  }
}

export async function updateStudent(id: number, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  enrollmentDate?: Date;
  departmentId?: number;
  isActive?: boolean;
}) {
  try {
    const updateData: Partial<NewStudent> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Handle dates properly
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = formatDate(data.dateOfBirth);
    }

    if (data.enrollmentDate !== undefined) {
      updateData.enrollmentDate = formatDate(data.enrollmentDate);
    }

    updateData.updatedAt = new Date();

    const result = await db.update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();

    revalidatePath('/students');
    return result[0];
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
  }
}

// Course Functions
export async function getCourses() {
  try {
    return await db.query.courses.findMany({
      with: {
        department: true,
        faculty: true,
      },
      orderBy: (courses, { asc }) => [asc(courses.code)],
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
}

export async function addCourse(data: {
  code: string;
  name: string;
  description?: string;
  credits: number;
  departmentId?: number;
  facultyId?: number;
  isActive?: boolean;
}) {
  try {
    const courseData: NewCourse = {
      code: data.code,
      name: data.name,
      description: data.description,
      credits: data.credits,
      departmentId: data.departmentId,
      facultyId: data.facultyId,
      isActive: data.isActive,
    };

    const result = await db.insert(courses).values(courseData).returning();
    revalidatePath('/courses');
    return result[0];
  } catch (error) {
    console.error('Error adding course:', error);
    throw new Error('Failed to add course');
  }
}

export async function updateCourse(id: number, data: {
  code?: string;
  name?: string;
  description?: string;
  credits?: number;
  departmentId?: number;
  facultyId?: number;
  isActive?: boolean;
}) {
  try {
    const updateData: Partial<NewCourse> = {};

    if (data.code !== undefined) updateData.code = data.code;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.credits !== undefined) updateData.credits = data.credits;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.facultyId !== undefined) updateData.facultyId = data.facultyId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    updateData.updatedAt = new Date();

    const result = await db.update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning();

    revalidatePath('/courses');
    return result[0];
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Failed to update course');
  }
}


export async function updateGrade(enrollmentId: number, grade: typeof gradeEnum.enumValues[number]) {
  try {
    const updateData: Partial<NewEnrollment> = {
      grade,
      updatedAt: new Date(),
    };

    const result = await db.update(enrollments)
      .set(updateData)
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    const enrollment = await db.query.enrollments.findFirst({
      where: eq(enrollments.id, enrollmentId),
      columns: {
        studentId: true,
        courseId: true,
      },
    });

    if (enrollment) {
      revalidatePath(`/students/${enrollment.studentId}`);
      revalidatePath(`/courses/${enrollment.courseId}`);
    }

    return result[0];
  } catch (error) {
    console.error('Error updating grade:', error);
    throw new Error('Failed to update grade');
  }
}


// Dashboard Statistics
export async function getDashboardStats() {
  try {
    const studentCount = await db.select({ count: sql<number>`count(*)` }).from(students);
    const facultyCount = await db.select({ count: sql<number>`count(*)` }).from(faculties);
    const courseCount = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const departmentCount = await db.select({ count: sql<number>`count(*)` }).from(departments);

    return {
      studentCount: studentCount[0].count,
      facultyCount: facultyCount[0].count,
      courseCount: courseCount[0].count,
      departmentCount: departmentCount[0].count,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}
export async function getFacultyById(id: number) {
    try {
      return await db.query.faculties.findFirst({
        where: eq(faculties.id, id),
        with: {
          department: true,
          courses: true,
        },
      });
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw new Error('Failed to fetch faculty');
    }
  }

  export async function getCourseById(id: number) {
    try {
      return await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
          department: true,
          faculty: true,
          enrollments: {
            with: {
              student: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  }
// ...existing code...

// Helper function for enrolling students directly from course creation
export async function enrollStudent(data: {
  studentId: number;
  courseId: number;
  semester: typeof semesterEnum.enumValues[number];
  year: number;
}) {
  try {
    // Check if student is already enrolled in this course for this semester and year
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.studentId, data.studentId),
        eq(enrollments.courseId, data.courseId),
        eq(enrollments.semester, data.semester),
        eq(enrollments.year, data.year)
      ),
    });

    if (existingEnrollment) {
      // If already enrolled, just return the existing enrollment
      return existingEnrollment;
    }

    const enrollmentData: NewEnrollment = {
      studentId: data.studentId,
      courseId: data.courseId,
      semester: data.semester,
      year: data.year,
    };

    const result = await db.insert(enrollments).values(enrollmentData).returning();
    revalidatePath(`/students/${data.studentId}`);
    revalidatePath(`/courses/${data.courseId}`);
    return result[0];
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw new Error('Failed to enroll student');
  }
}

// Add this function to lib/actions.ts
export async function assignFacultyToDepartment(facultyId: number, departmentId: number) {
    try {
      const result = await db.update(faculties)
        .set({
          departmentId: departmentId,
          updatedAt: new Date()
        })
        .where(eq(faculties.id, facultyId))
        .returning();

      revalidatePath(`/departments/${departmentId}`);
      revalidatePath(`/faculties/${facultyId}`);
      return result[0];
    } catch (error) {
      console.error('Error assigning faculty to department:', error);
      throw new Error('Failed to assign faculty to department');
    }
  }

  // Update getDepartments to include faculties and courses
  export async function getDepartmentss() {
    try {
      return await db.query.departments.findMany({
        with: {
          faculties: true,
          courses: true,
        },
        orderBy: (departments, { asc }) => [asc(departments.name)],
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw new Error('Failed to fetch departments');
    }
  }

  // Add this function if it doesn't exist
  export async function getDepartmentById(id: number) {
    try {
      return await db.query.departments.findFirst({
        where: eq(departments.id, id),
        with: {
          faculties: true,
          courses: true,
        },
      });
    } catch (error) {
      console.error('Error fetching department:', error);
      throw new Error('Failed to fetch department');
    }
  }

  // Attendance Functions
export async function getAttendance() {
  try {
    return await db.query.attendance.findMany({
      with: {
        enrollment: {
          with: {
            student: true,
            course: true,
          },
        },
      },
      orderBy: (attendance, { desc }) => [desc(attendance.date)],
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw new Error('Failed to fetch attendance');
  }
}

export async function getAttendanceById(id: number) {
  try {
    return await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
      with: {
        enrollment: {
          with: {
            student: true,
            course: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    throw new Error('Failed to fetch attendance record');
  }
}

export async function getAttendanceByStudentId(studentId: number) {
  try {
    const studentEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.studentId, studentId),
      with: {
        course: true,
      },
    });

    const enrollmentIds = studentEnrollments.map(enrollment => enrollment.id);

    if (enrollmentIds.length === 0) {
      return [];
    }

    return await db.query.attendance.findMany({
      where: inArray(attendance.enrollmentId, enrollmentIds),
      with: {
        enrollment: {
          with: {
            course: true,
          },
        },
      },
      orderBy: (attendance, { desc }) => [desc(attendance.date)],
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw new Error('Failed to fetch student attendance');
  }
}

export async function getAttendanceByCourseId(courseId: number) {
  try {
    const courseEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.courseId, courseId),
      with: {
        student: true,
      },
    });

    const enrollmentIds = courseEnrollments.map(enrollment => enrollment.id);

    if (enrollmentIds.length === 0) {
      return [];
    }

    return await db.query.attendance.findMany({
      where: inArray(attendance.enrollmentId, enrollmentIds),
      with: {
        enrollment: {
          with: {
            student: true,
          },
        },
      },
      orderBy: (attendance, { desc }) => [desc(attendance.date)],
    });
  } catch (error) {
    console.error('Error fetching course attendance:', error);
    throw new Error('Failed to fetch course attendance');
  }
}

export async function markAttendance(data: any) {
  try {
    // Check if attendance already exists for this date and enrollment
    const existingAttendance = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.enrollmentId, data.enrollmentId),
        eq(attendance.date, data.date instanceof Date ? formatDate(data.date) : data.date)
      ),
    });

    let result;
    if (existingAttendance) {
      // Update existing attendance
      const updateData: any = {
        isPresent: data.isPresent,
        remarks: data.remarks,
        updatedAt: new Date().toISOString(),
      };

      result = await db.update(attendance)
        .set(updateData)
        .where(eq(attendance.id, existingAttendance.id))
        .returning();
    } else {
      // Create new attendance record
      const attendanceData: any = {
        enrollmentId: data.enrollmentId,
        date: data.date instanceof Date ? formatDate(data.date) : data.date,
        isPresent: data.isPresent,
        remarks: data.remarks,
      };

      result = await db.insert(attendance).values(attendanceData).returning();
    }

    const enrollment = await db.query.enrollments.findFirst({
      where: eq(enrollments.id, data.enrollmentId),
      columns: {
        studentId: true,
        courseId: true,
      },
    });

    if (enrollment) {
      revalidatePath(`/students/${enrollment.studentId}`);
      revalidatePath(`/courses/${enrollment.courseId}`);
      revalidatePath('/attendance');
    }

    return result[0];
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw new Error('Failed to mark attendance');
  }
}

export async function updateAttendance(id: number, data: any) {
  try {
    const updateData: any = {
      isPresent: data.isPresent,
      remarks: data.remarks,
      updatedAt: new Date().toISOString(),
    };

    if (data.date) {
      updateData.date = data.date instanceof Date ? formatDate(data.date) : data.date;
    }

    const result = await db.update(attendance)
      .set(updateData)
      .where(eq(attendance.id, id))
      .returning();

    const attendanceRecord = await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
      with: {
        enrollment: {
          columns: {
            studentId: true,
            courseId: true,
          },
        },
      },
    });

    if (attendanceRecord?.enrollment) {
      revalidatePath(`/students/${attendanceRecord.enrollment.studentId}`);
      revalidatePath(`/courses/${attendanceRecord.enrollment.courseId}`);
      revalidatePath('/attendance');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw new Error('Failed to update attendance');
  }
}

export async function deleteAttendance(id: number) {
  try {
    const attendanceRecord = await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
      with: {
        enrollment: {
          columns: {
            studentId: true,
            courseId: true,
          },
        },
      },
    });

    const result = await db.delete(attendance)
      .where(eq(attendance.id, id))
      .returning();

    if (attendanceRecord?.enrollment) {
      revalidatePath(`/students/${attendanceRecord.enrollment.studentId}`);
      revalidatePath(`/courses/${attendanceRecord.enrollment.courseId}`);
      revalidatePath('/attendance');
    }

    return result[0];
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw new Error('Failed to delete attendance');
  }
}

// Marks Functions
export async function getMarks() {
  try {
    return await db.query.marks.findMany({
      with: {
        enrollment: {
          with: {
            student: true,
            course: true,
          },
        },
      },
      orderBy: (marks, { desc }) => [desc(marks.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching marks:', error);
    throw new Error('Failed to fetch marks');
  }
}

export async function getMarkById(id: number) {
  try {
    return await db.query.marks.findFirst({
      where: eq(marks.id, id),
      with: {
        enrollment: {
          with: {
            student: true,
            course: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching mark:', error);
    throw new Error('Failed to fetch mark');
  }
}

export async function getMarksByStudentId(studentId: number) {
  try {
    const studentEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.studentId, studentId),
      with: {
        course: true,
      },
    });

    const enrollmentIds = studentEnrollments.map(enrollment => enrollment.id);

    if (enrollmentIds.length === 0) {
      return [];
    }

    return await db.query.marks.findMany({
      where: inArray(marks.enrollmentId, enrollmentIds),
      with: {
        enrollment: {
          with: {
            course: true,
          },
        },
      },
      orderBy: (marks, { desc }) => [desc(marks.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching student marks:', error);
    throw new Error('Failed to fetch student marks');
  }
}

export async function getMarksByCourseId(courseId: number) {
  try {
    const courseEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.courseId, courseId),
      with: {
        student: true,
      },
    });

    const enrollmentIds = courseEnrollments.map(enrollment => enrollment.id);

    if (enrollmentIds.length === 0) {
      return [];
    }

    return await db.query.marks.findMany({
      where: inArray(marks.enrollmentId, enrollmentIds),
      with: {
        enrollment: {
          with: {
            student: true,
          },
        },
      },
      orderBy: (marks, { desc }) => [desc(marks.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching course marks:', error);
    throw new Error('Failed to fetch course marks');
  }
}

export async function addMarks(data: any) {
  try {
    const marksData: any = {
      enrollmentId: data.enrollmentId,
      examType: data.examType,
      score: data.score.toString(), // Convert to string for numeric type
      maxScore: data.maxScore.toString(), // Convert to string for numeric type
      remarks: data.remarks,
    };

    const result = await db.insert(marks).values(marksData).returning();

    const enrollment = await db.query.enrollments.findFirst({
      where: eq(enrollments.id, data.enrollmentId),
      columns: {
        studentId: true,
        courseId: true,
      },
    });

    if (enrollment) {
      revalidatePath(`/students/${enrollment.studentId}`);
      revalidatePath(`/courses/${enrollment.courseId}`);
      revalidatePath('/marks');
    }

    return result[0];
  } catch (error) {
    console.error('Error adding marks:', error);
    throw new Error('Failed to add marks');
  }
}

export async function updateMarks(id: number, data: any) {
  try {
    const updateData: any = {};

    if (data.examType !== undefined) updateData.examType = data.examType;
    if (data.score !== undefined) updateData.score = data.score.toString();
    if (data.maxScore !== undefined) updateData.maxScore = data.maxScore.toString();
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    updateData.updatedAt = new Date().toISOString();

    const result = await db.update(marks)
      .set(updateData)
      .where(eq(marks.id, id))
      .returning();

    const mark = await db.query.marks.findFirst({
      where: eq(marks.id, id),
      with: {
        enrollment: {
          columns: {
            studentId: true,
            courseId: true,
          },
        },
      },
    });

    if (mark?.enrollment) {
      revalidatePath(`/students/${mark.enrollment.studentId}`);
      revalidatePath(`/courses/${mark.enrollment.courseId}`);
      revalidatePath('/marks');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating marks:', error);
    throw new Error('Failed to update marks');
  }
}

export async function deleteMarks(id: number) {
  try {
    const mark = await db.query.marks.findFirst({
      where: eq(marks.id, id),
      with: {
        enrollment: {
          columns: {
            studentId: true,
            courseId: true,
          },
        },
      },
    });

    const result = await db.delete(marks)
      .where(eq(marks.id, id))
      .returning();

    if (mark?.enrollment) {
      revalidatePath(`/students/${mark.enrollment.studentId}`);
      revalidatePath(`/courses/${mark.enrollment.courseId}`);
      revalidatePath('/marks');
    }

    return result[0];
  } catch (error) {
    console.error('Error deleting marks:', error);
    throw new Error('Failed to delete marks');
  }
}

// Helper function to get enrollments
export async function getEnrollments() {
  try {
    return await db.query.enrollments.findMany({
      with: {
        student: true,
        course: true,
      },
      orderBy: (enrollments, { desc }) => [desc(enrollments.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw new Error('Failed to fetch enrollments');
  }
}

// Helper function for date formatting - already defined at the top of file
