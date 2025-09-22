import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    await prisma.chatHistory.upsert({
      where: { userId: session.user.id },
      update: { 
        messages,
        updatedAt: new Date() 
      },
      create: { 
        userId: session.user.id, 
        messages 
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chat save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

