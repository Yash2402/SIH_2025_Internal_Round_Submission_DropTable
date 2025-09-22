import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.chatHistory.deleteMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chat clear error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

