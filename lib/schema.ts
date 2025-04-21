import { pgTable, serial, text, integer, timestamp, boolean, uuid, pgEnum, foreignKey, varchar, date, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['student', 'faculty', 'admin']);
export const semesterEnum = pgEnum('semester', ['Fall', 'Spring', 'Summer']);
export const gradeEnum = pgEnum('grade', ['A', 'B', 'C', 'D', 'F', 'I', 'W']);

// Departments Table
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Department Relations
export const departmentsRelations = relations(departments, ({ many }) => ({
  faculties: many(faculties),
  courses: many(courses),
}));

// Faculties Table
export const faculties = pgTable('faculties', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  departmentId: integer('department_id').references(() => departments.id, { onDelete: 'set null' }),
  designation: text('designation'),
  joinDate: date('join_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Faculty Relations
export const facultiesRelations = relations(faculties, ({ one, many }) => ({
  department: one(departments, {
    fields: [faculties.departmentId],
    references: [departments.id],
  }),
  courses: many(courses),
}));

// Courses Table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  credits: integer('credits').notNull(),
  departmentId: integer('department_id').references(() => departments.id, { onDelete: 'set null' }),
  facultyId: integer('faculty_id').references(() => faculties.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Course Relations
export const coursesRelations = relations(courses, ({ one, many }) => ({
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id],
  }),
  faculty: one(faculties, {
    fields: [courses.facultyId],
    references: [faculties.id],
  }),
  enrollments: many(enrollments),
}));

// Students Table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  dateOfBirth: date('date_of_birth'),
  address: text('address'),
  enrollmentDate: date('enrollment_date').notNull(),
  departmentId: integer('department_id').references(() => departments.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Student Relations
export const studentsRelations = relations(students, ({ one, many }) => ({
  department: one(departments, {
    fields: [students.departmentId],
    references: [departments.id],
  }),
  enrollments: many(enrollments),
}));

// Enrollments Table (connects students to courses)
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  semester: semesterEnum('semester').notNull(),
  year: integer('year').notNull(),
  grade: gradeEnum('grade'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enrollment Relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Marks Table
export const marks = pgTable('marks', {
  id: serial('id').primaryKey(),
  enrollmentId: integer('enrollment_id').notNull().references(() => enrollments.id, { onDelete: 'cascade' }),
  examType: text('exam_type').notNull(), // midterm, final, assignment, etc.
  score: numeric('score').notNull(),
  maxScore: numeric('max_score').notNull(),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Marks Relations
export const marksRelations = relations(marks, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [marks.enrollmentId],
    references: [enrollments.id],
  }),
}));

// Attendance Table
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  enrollmentId: integer('enrollment_id').notNull().references(() => enrollments.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  isPresent: boolean('is_present').default(false),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Attendance Relations
export const attendanceRelations = relations(attendance, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [attendance.enrollmentId],
    references: [enrollments.id],
  }),
}));
