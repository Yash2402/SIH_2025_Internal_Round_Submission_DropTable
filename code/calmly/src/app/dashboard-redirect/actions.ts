"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function setUserRole(role: UserRole) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("🔴 User is not authenticated when setting role");
    throw new Error("Not authenticated");
  }

  console.log(`🟢 Setting role ${role} for user ${session.user.id}`);

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });
    
    revalidatePath("/dashboard-redirect");
    console.log("🟢 Role updated successfully");
    
    // Return the role instead of redirecting
    return { success: true, role };
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    throw new Error("Failed to set user role");
  }
}

