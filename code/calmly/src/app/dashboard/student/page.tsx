import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import StudentDashboardTabs from "./_components/dashboard-tabs";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // Get user data with existing relationships only
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      phq9Scores: {
        orderBy: { createdAt: 'desc' },
        take: 5, // Last 5 scores
      },
      gad7Scores: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      bookings: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      institution: true,
      chatHistories: true, // Remove the nested messages include
    },
  });

  if (!user || user.role !== 'STUDENT') {
    redirect('/dashboard-redirect');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image src="/icon.png" alt="Calmly Logo" width={120} height={32} className="h-8 w-auto" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name || 'Student'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "S"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <StudentDashboardTabs user={user} />
      </main>
    </div>
  );
}
