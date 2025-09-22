import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Sansita } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import InstitutionDashboardTabs from "./_components/dashboard-tabs";

const sansita = Sansita({
    variable: "--font-sansita",
    subsets: ["latin"],
    weight: ["400", "700"],
});

// This is a Server Component, so we can fetch data directly.
async function getInstitutionData(userId: string) {
    const adminUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { institutionId: true, email: true, name: true }
    });

    if (!adminUser?.institutionId) {
        // If the admin isn't linked to an institution, maybe they need to onboard first.
        redirect('/onboarding/institution');
    }

    // Fetch the institution and all related data in one query
    const institution = await prisma.institution.findUnique({
        where: { id: adminUser.institutionId },
        include: {
            users: { where: { role: 'STUDENT' } }, // Count only students
            therapists: true,
            // We can add bookings later if needed
        }
    });

    if (!institution) {
        throw new Error("Institution not found for the logged-in admin.");
    }

    // Return both the admin's details and the full institution data
    return { adminUser, institution };
}

export default async function InstitutionDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/sign-in');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, email: true, name: true },
    });

    if (!user || user.role !== 'INSTITUTION_ADMIN') {
        redirect('/dashboard-redirect');
    }
    // Fetch all necessary data
    const { adminUser, institution } = await getInstitutionData(session.user.id);

    // Calculate stats
    // const totalStudents = institution.users.length;
    // const activeTherapists = institution.therapists.length;

    return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header - Styled just like the student dashboard */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image src="/icon.png" alt="Calmly Logo" width={32} height={32} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{institution.name}</h1>
                <p className="text-sm text-gray-600">Administrator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                {adminUser.image ? (
                  <Image 
                    src={adminUser.image} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {adminUser.name?.charAt(0) || adminUser.email?.charAt(0) || "A"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* The page now renders the tab system, passing the institution data to it */}
        <InstitutionDashboardTabs institution={institution} />
      </main>
    </div>
  );
}
