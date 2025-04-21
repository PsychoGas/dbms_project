'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home, Users, BookOpen, GraduationCap, Building2,
  CalendarDays, FileText, Settings
} from 'lucide-react';

const routes = [
  {
    name: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    name: 'Students',
    path: '/students',
    icon: Users,
  },
  {
    name: 'Faculties',
    path: '/faculties',
    icon: GraduationCap,
  },
  {
    name: 'Departments',
    path: '/departments',
    icon: Building2,
  },
  {
    name: 'Courses',
    path: '/courses',
    icon: BookOpen,
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: CalendarDays,
  },
  {
    name: 'Marks',
    path: '/marks',
    icon: FileText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">School Management</h1>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === route.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
