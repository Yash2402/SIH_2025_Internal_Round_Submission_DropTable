import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Create institution
    const institution = await prisma.institution.create({
      data: {
        name: data.institutionName,
        email: data.hodEmail,
        hodName: data.hodName,
        hodEmail: data.hodEmail,
        hodPhone: data.hodPhone,
        totalStudents: parseInt(data.totalStudents),
        institutionType: data.institutionType,
        address: data.address,
        city: data.city,
        state: data.state,
        website: data.website,
        established: data.established ? parseInt(data.established) : null,
      },
    });

    // Link user to institution
    await prisma.user.update({
      where: { id: session.user.id },
      data: { institutionId: institution.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Institution onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

