// import { getServerSession } from "next-auth";
// import { authOptions } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
//
// export async function PUT(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//
//   try {
//     const data = await request.json();
//     
//     await prisma.user.update({
//       where: { id: session.user.id },
//       data: {
//         name: data.name,
//         studentId: data.studentId,
//         dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
//         gender: data.gender,
//         phoneNumber: data.phoneNumber,
//         emergencyContact: data.emergencyContact,
//         emergencyPhone: data.emergencyPhone,
//       },
//     });
//
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("User update error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
//

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const data = await request.json();

    // --- MODIFIED LOGIC ---
    // We are now updating the user's profile with potentially more fields.
    // The role update logic is preserved for the RoleSelector page.
    // The student profile update logic is added for the Settings page.

    const updateData: any = {};

    // For the RoleSelector page
    if (data.role) {
      if (!Object.values(UserRole).includes(data.role)) {
        return NextResponse.json({ error: "A valid role is required." }, { status: 400 });
      }
      if (data.role === 'STUDENT' && !data.institutionId) {
        return NextResponse.json({ error: "Please select your institution." }, { status: 400 });
      }
      updateData.role = data.role;
      updateData.institutionId = data.role === 'STUDENT' ? data.institutionId : null;
    }

    // For the Student Settings page
    if (data.studentId !== undefined) updateData.studentId = data.studentId;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact;
    if (data.emergencyPhone !== undefined) updateData.emergencyPhone = data.emergencyPhone;
    
    // Conditionally update institutionId only if the user doesn't already have one
    if (data.institutionId) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { institutionId: true } });
        if (!user?.institutionId) {
            updateData.institutionId = data.institutionId;
        }
    }

    // Update the user's record with all the provided data
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
