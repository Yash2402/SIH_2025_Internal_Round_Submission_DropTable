import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const history = await prisma.chatHistory.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ messages: history?.messages ?? [] });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

