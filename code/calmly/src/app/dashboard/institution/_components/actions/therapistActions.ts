"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // 1. CORRECT: Import authOptions
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface TherapistData {
  name: string;
  email: string;
  specialty: string[];
  institutionId: string;
}

/**
 * Adds a new therapist to a specific institution.
 */
export async function addTherapist(data: TherapistData) {
  // 2. CORRECT: Use getServerSession to get the user's session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  // Security check: Ensure the logged-in user is an admin of the target institution.
  const adminUser = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      role: 'INSTITUTION_ADMIN',
      institutionId: data.institutionId,
    },
  });

  if (!adminUser) {
    return { success: false, message: "Permission denied." };
  }

  try {
    await prisma.therapist.create({
      data: {
        name: data.name,
        email: data.email,
        specialty: data.specialty,
        institutionId: data.institutionId,
      },
    });

    // Revalidate the dashboard path to show the new therapist immediately.
    revalidatePath('/dashboard/institution');
    return { success: true, message: "Therapist added successfully." };

  } catch (error) {
    console.error("Error adding therapist:", error);
    if ((error as any).code === 'P2002') {
        return { success: false, message: "A therapist with this email already exists." };
    }
    return { success: false, message: "Failed to add therapist." };
  }
}

/**
 * Deletes a therapist from an institution.
 */
export async function deleteTherapist(therapistId: string, institutionId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized." };
    }

    // Security check
    const adminUser = await prisma.user.findFirst({
        where: {
            id: session.user.id,
            role: 'INSTITUTION_ADMIN',
            institutionId: institutionId,
        },
    });

    if (!adminUser) {
        return { success: false, message: "Permission denied." };
    }

    try {
        await prisma.therapist.delete({
            where: { id: therapistId },
        });

        revalidatePath('/dashboard/institution');
        return { success: true, message: "Therapist deleted." };

    } catch (error) {
        console.error("Error deleting therapist:", error);
        return { success: false, message: "Failed to delete therapist." };
    }
}
