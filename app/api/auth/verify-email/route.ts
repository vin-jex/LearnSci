import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeTokenBidirectional } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const userId = await consumeTokenBidirectional("email_verify", token);
    if (!userId) {
      return NextResponse.json(
        { error: "This verification link has expired or already been used." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
