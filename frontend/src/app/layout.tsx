// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Multi-App Scheduler",
  description: "Schedule posts for multiple apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <Link href="/" className="text-2xl font-bold">
            📌 Multi-App Scheduler
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/jobs" className="hover:underline">
              Scheduled Jobs
            </Link>
          </div>
        </nav>

        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-4 text-center text-sm mt-10">
          © {new Date().getFullYear()} Multi-App Scheduler · Built with ❤️
          Next.js
        </footer>
      </body>
    </html>
  );
}
