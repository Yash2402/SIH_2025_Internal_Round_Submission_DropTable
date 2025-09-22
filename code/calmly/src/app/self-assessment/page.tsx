import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";        // your NextAuth config
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SelfAssessment } from "@/components/self-assessment/SelfAssessment"; // Import the client component
import Image from "next/image";
import Link from "next/link";

// This is a Server Component, so we can fetch data directly
async function getUserData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect('/api/auth/signin?callbackUrl=/self-assessment');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user || user.role !== 'STUDENT') {
        redirect('/dashboard-redirect'); // Or to a relevant page
    }
    return user;
}

export default async function SelfAssessmentPage() {
    const user = await getUserData();

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-white relative overflow-hidden">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Image src="/icon.png" alt="Calmly Logo" width={32} height={32} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Screening</h1>
                                <p className="text-sm text-gray-600">Welcome back, {user.name || 'Student'}!</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                                {user.image ? (
                                    <Image src={user.image} alt="Profile" width={40} height={40} className="rounded-full" />
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

            {/* Render your client component and pass the user data as a prop */}
            <SelfAssessment user={user} />
        </div>
    );
}
