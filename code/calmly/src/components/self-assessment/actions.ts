"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";        // your NextAuth config
import prisma from "@/lib/prisma";

// Data shape for incoming test result
interface TestResultData {
  type: "phq9" | "gad7";
  score: number;
  severity: string;
  responses: Record<number, number>;
}

/**
 * saveTestResult
 * Server action to save PHQ-9 or GAD-7 results for the authenticated user.
 */
export async function saveTestResult(data: TestResultData) {
  // 1. Get the user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "User is not authenticated." };
  }
  const userId = session.user.id;

try {
    if (data.type === "phq9") {
      await prisma.pHQ9Score.create({
        data: {
          userId,
          score: data.score, // 2. CORRECT: Field name is 'score' in your schema
          level: data.severity,
          responses: data.responses,
        },
      });
    } else if (data.type === "gad7") {
      await prisma.gAD7Score.create({
        data: {
          userId,
          score: data.score, // 2. CORRECT: Field name is 'score' in your schema
          level: data.severity,
          responses: data.responses,
        },
      });
    } else {
      return { success: false, message: "Invalid test type." };
    }

    return { success: true, message: "Test results saved successfully." };
  } catch (error) {
    console.error("Error saving test result:", error);
    return { success: false, message: "An error occurred while saving the results." };
  }
}
