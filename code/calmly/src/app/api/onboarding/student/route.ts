// import { getServerSession } from "next-auth";
// import { authOptions } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
//
// export async function POST(request: NextRequest) {
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
//         studentId: data.studentId,
//         dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
//         gender: data.gender,
//         phoneNumber: data.phoneNumber,
//         emergencyContact: data.emergencyContact,
//         emergencyPhone: data.emergencyPhone,
//         medicalHistory: data.medicalHistory,
//         currentMedications: data.currentMedications,
//         previousTherapy: data.previousTherapy,
//         consentGiven: data.consentGiven,
//       },
//     });
//
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Student onboarding error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
//
// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//
//   try {
//     const data = await request.json();
//     
//     // --- 1. ADDED: Validate that an institution was selected ---
//     if (!data.institutionId) {
//       return NextResponse.json({ error: "Institution is a required field." }, { status: 400 });
//     }
//
//     await prisma.user.update({
//       where: { id: session.user.id },
//       data: {
//         // --- 2. ADDED: Save the institutionId to the user's record ---
//         institutionId: data.institutionId,
//         
//         // Your existing fields remain the same
//         studentId: data.studentId,
//         dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
//         gender: data.gender,
//         phoneNumber: data.phoneNumber,
//         emergencyContact: data.emergencyContact,
//         emergencyPhone: data.emergencyPhone,
//         medicalHistory: data.medicalHistory,
//         currentMedications: data.currentMedications,
//         previousTherapy: data.previousTherapy,
//         consentGiven: data.consentGiven,
//       },
//     });
//
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Student onboarding error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


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
    
    if (!data.institutionId) {
      return NextResponse.json({ error: "Institution is a required field." }, { status: 400 });
    }

    // --- THIS IS THE FIX ---
    // Convert the 'previousTherapy' string to a boolean.
    // The expression (data.previousTherapy === 'true') will evaluate to:
    // - `true` if the string is "true"
    // - `false` if the string is "false" or anything else
    const previousTherapyBoolean = data.previousTherapy === 'true';

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        institutionId: data.institutionId,
        studentId: data.studentId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        previousTherapy: previousTherapyBoolean, // Use the converted boolean value
        consentGiven: data.consentGiven,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
