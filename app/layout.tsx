import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "../components/theme-provider";
import Sidebar from "../components/sidebar"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'A comprehensive school management system built with Next.js and Drizzle ORM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
