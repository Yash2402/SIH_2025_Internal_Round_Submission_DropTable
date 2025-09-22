import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoleSelector } from "./_components/role-selector";

export default async function DashboardRedirectPage() {
  console.log("🟢 dashboard-redirect start");

  const session = await getServerSession(authOptions);
  console.log("🟢 session:", { userId: session?.user?.id, role: (session?.user as any)?.role });

  if (!session?.user?.id) {
    console.log("🔴 No session user id, redirecting to sign-in");
    redirect("/sign-in");
  }

  // Get fresh user data from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });

  console.log("🟢 DB user:", user);

  if (!user) {
    console.log("🔴 User not found in DB");
    return (
      <div className="min-h-screen text-red-600 flex flex-col items-center justify-center">
        <h1>User not found in database. Please contact support.</h1>
        <p>User ID: {session.user.id}</p>
      </div>
    );
  }

  if (user.role === "STUDENT") {
    console.log("🔵 Redirecting to student dashboard");
    redirect("/dashboard/student");
  }
  
  if (user.role === "INSTITUTION_ADMIN") {
    console.log("🟣 Redirecting to institution dashboard");
    redirect("/dashboard/institution");
  }

  console.log("🟡 No role set, rendering role selector");
  return <RoleSelector />;
}

