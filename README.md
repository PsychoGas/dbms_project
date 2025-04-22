# School Management System

A comprehensive School Management System built with Next.js, Drizzle ORM, and Supabase. This application provides a complete solution for managing students, faculties, departments, courses, enrollments, marks, and attendance.

## Features

- **Dashboard**: Overview of key statistics and metrics
- **Students Management**: Add, view, edit, and manage student records
- **Faculty Management**: Manage faculty members and their department assignments
- **Department Management**: Create and manage academic departments
- **Course Management**: Create courses and assign them to departments and faculty
- **Enrollment System**: Enroll students in courses for specific semesters
- **Marks Management**: Record and track student performance across different exams
- **Attendance Tracking**: Monitor student attendance for each course
- **Reports and Analytics**: Generate insights from academic data

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: ShadCN UI (built on Radix UI)
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (hosted on Supabase)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
├── app/                  # Next.js app router pages
│   ├── attendance/       # Attendance management pages
│   ├── courses/          # Course management pages
│   ├── departments/      # Department management pages
│   ├── faculties/        # Faculty management pages
│   ├── marks/            # Marks management pages
│   ├── students/         # Student management pages
│   └── page.tsx          # Dashboard page
├── components/           # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   └── ...               # Custom components
├── lib/                  # Utility functions and business logic
│   ├── actions.ts        # Server actions for data operations
│   ├── db.ts             # Database connection setup
│   └── schema.ts         # Drizzle ORM schema definitions
├── public/               # Static assets
├── drizzle/              # Drizzle migrations
├── drizzle.config.ts     # Drizzle configuration
└── ...                   # Configuration files
```

## Database Schema

The system uses the following database tables:

- **departments**: Academic departments
- **faculties**: Faculty members teaching courses
- **students**: Student records
- **courses**: Available courses
- **enrollments**: Student enrollments in courses
- **marks**: Student performance records
- **attendance**: Student attendance records

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (or any PostgreSQL database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-management-system.git
   cd school-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

4. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```

5. Seed the database with initial data:
   ```bash
   npm run seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Dashboard

The dashboard provides an overview of key statistics including total students, faculty members, departments, and courses.

### Managing Students

- View all students from the Students page
- Add new students using the Add Student form
- View detailed student information including enrolled courses
- Update student information as needed

### Managing Courses

- Create new courses and assign them to departments
- Assign faculty members to courses
- View course details including enrolled students
- Manage course status (active/inactive)

### Recording Marks

- Add exam marks for students enrolled in courses
- View mark statistics by exam type
- Edit and update mark records
- Generate performance reports

### Tracking Attendance

- Mark student attendance for each class
- View attendance records by date or by student
- Generate attendance reports and statistics

## Development

### Database Migrations

When making changes to the database schema:

1. Update the schema in `lib/schema.ts`
2. Run the migration:
   ```bash
   npx drizzle-kit push
   ```

### Adding New Features

1. Define any new database tables in `lib/schema.ts`
2. Add server actions in `lib/actions.ts`
3. Create UI components in the `components` directory
4. Add pages in the appropriate directory under `app/`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Supabase](https://supabase.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---
Answer from Perplexity: pplx.ai/share
