"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Fetches detailed, non-identifiable report data for a single student.
 * SECURE: Verifies that the requesting admin belongs to the same institution as the student.
 */
export async function getStudentDetails(studentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  // 1. Get the admin's institution ID for security check
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { institutionId: true },
  });

  if (!admin?.institutionId) {
    return { success: false, message: "Admin not linked to an institution." };
  }

  try {
    // 2. Fetch the student's data, BUT only if they belong to the admin's institution.
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        institutionId: admin.institutionId, // CRITICAL SECURITY CHECK
      },
      select: {
        emergencyContact: true,
        emergencyPhone: true,
        phq9Scores: {
          select: { score: true, createdAt: true },
          orderBy: { createdAt: 'asc' }, // Order ascending for trend graphs
        },
        gad7Scores: {
          select: { score: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!student) {
      return { success: false, message: "Student not found or access denied." };
    }

    // 3. Return the detailed data
    return { success: true, data: student };

  } catch (error) {
    console.error("Error fetching student details:", error);
    return { success: false, message: "Failed to fetch student details." };
  }
}
