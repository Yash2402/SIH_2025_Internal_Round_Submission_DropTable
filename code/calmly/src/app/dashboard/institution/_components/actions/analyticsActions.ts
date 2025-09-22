"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Fetches and aggregates anonymized analytics data for an institution.
 */
export async function getAnalyticsData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized.");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { institutionId: true },
  });

  if (!adminUser?.institutionId) {
    throw new Error("User is not associated with an institution.");
  }
  const { institutionId } = adminUser;

  try {
    const [phq9Scores, gad7Scores] = await Promise.all([
      prisma.pHQ9Score.findMany({
        where: { user: { institutionId: institutionId } },
        select: { score: true, level: true, createdAt: true },
      }),
      prisma.gAD7Score.findMany({
        where: { user: { institutionId: institutionId } },
        select: { score: true, level: true, createdAt: true },
      }),
    ]);

    // --- THIS IS THE NEW LOGIC THAT WAS MISSING ---
    const processMonthlyData = (scores: { score: number; createdAt: Date }[]) => {
      const monthlyMap = scores.reduce((acc, score) => {
        const month = score.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
        if (!acc[month]) {
          acc[month] = { scoreSum: 0, count: 0 };
        }
        acc[month].scoreSum += score.score;
        acc[month].count++;
        return acc;
      }, {} as Record<string, { scoreSum: number; count: number }>);

      return Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        averageScore: data.scoreSum / data.count,
        screenings: data.count,
      })).sort((a, b) => a.month.localeCompare(b.month));
    };

    const monthlyPHQ9 = processMonthlyData(phq9Scores);
    const monthlyGAD7 = processMonthlyData(gad7Scores);
    
    const allMonths = [...new Set([...monthlyPHQ9.map(d => d.month), ...monthlyGAD7.map(d => d.month)])].sort();
    
    const monthlyTrends = allMonths.map(month => {
      const phq9Data = monthlyPHQ9.find(d => d.month === month);
      const gad7Data = monthlyGAD7.find(d => d.month === month);
      return {
        month,
        "PHQ-9 Average": phq9Data ? phq9Data.averageScore : null,
        "GAD-7 Average": gad7Data ? gad7Data.averageScore : null,
      };
    });

    const screeningsPerMonth = allMonths.map(month => {
        const phq9Data = monthlyPHQ9.find(d => d.month === month);
        const gad7Data = monthlyGAD7.find(d => d.month === month);
        return {
            month,
            screenings: (phq9Data?.screenings || 0) + (gad7Data?.screenings || 0),
        };
    });
    // --- END OF NEW LOGIC ---

    const processScores = (scores: { level: string }[]) => {
      const distribution: Record<string, number> = {
        Minimal: 0, Mild: 0, Moderate: 0, 'Moderately Severe': 0, Severe: 0,
      };
      scores.forEach(score => {
        if (score.level.includes("Minimal")) distribution.Minimal++;
        else if (score.level.includes("Mild")) distribution.Mild++;
        else if (score.level.includes("Moderately Severe")) distribution['Moderately Severe']++;
        else if (score.level.includes("Moderate")) distribution.Moderate++;
        else if (score.level.includes("Severe")) distribution.Severe++;
      });
      return distribution;
    };
    
    const phq9Distribution = processScores(phq9Scores);
    const gad7Distribution = processScores(gad7Scores);

    return {
      success: true,
      data: {
        totalScreenings: phq9Scores.length + gad7Scores.length,
        phq9: {
          count: phq9Scores.length,
          averageScore: phq9Scores.length > 0 ? phq9Scores.reduce((acc, s) => acc + s.score, 0) / phq9Scores.length : 0,
          distribution: phq9Distribution,
        },
        gad7: {
          count: gad7Scores.length,
          averageScore: gad7Scores.length > 0 ? gad7Scores.reduce((acc, s) => acc + s.score, 0) / gad7Scores.length : 0,
          distribution: gad7Distribution,
        },
        // --- ADD THE NEW DATA TO THE RESPONSE ---
        monthlyTrends,
        screeningsPerMonth,
      },
    };

  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { success: false, message: "Failed to fetch analytics data." };
  }
}
