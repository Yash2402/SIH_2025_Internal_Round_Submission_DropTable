"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Define the shape of the data we expect from the settings form
interface InstitutionSettingsData {
  institutionId: string;
  name: string;
  email: string;
  hodName: string;
  hodEmail: string;
  hodPhone: string;
  website?: string;
}

/**
 * Updates the settings for a specific institution.
 */
export async function updateInstitutionSettings(data: InstitutionSettingsData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  // Security check: Ensure the logged-in user is an admin of the institution they are trying to edit.
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
    // Update the institution's details in the database
    await prisma.institution.update({
      where: { id: data.institutionId },
      data: {
        name: data.name,
        email: data.email,
        hodName: data.hodName,
        hodEmail: data.hodEmail,
        hodPhone: data.hodPhone,
        website: data.website,
      },
    });

    // Revalidate the dashboard path to reflect any changes immediately.
    revalidatePath('/dashboard/institution');
    return { success: true, message: "Settings updated successfully." };

  } catch (error) {
    console.error("Error updating institution settings:", error);
    return { success: false, message: "Failed to update settings." };
  }
}
