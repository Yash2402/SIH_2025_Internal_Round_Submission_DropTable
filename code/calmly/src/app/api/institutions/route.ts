import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/institutions
 * Fetches a list of all institutions for any authenticated user.
 * This is used in the student onboarding process.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Security: Ensure the user is logged in before giving them the list.
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc', // Sort them alphabetically
      },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
