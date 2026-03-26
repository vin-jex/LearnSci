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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified.",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return NextResponse.json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", req.url),
      );
    }

    const userId = await consumeTokenBidirectional("email_verify", token);

    if (!userId) {
      return NextResponse.redirect(
        new URL("/login?error=expired_token", req.url),
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("[VERIFY_EMAIL_GET]", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}
