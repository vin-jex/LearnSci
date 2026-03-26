import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { storeTokenBidirectional, getExistingToken } from "@/lib/redis";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a verification link has been sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified.",
      });
    }

    let token = await getExistingToken("email_verify", user.id);

    if (!token) {
      token = randomBytes(32).toString("hex");
      await storeTokenBidirectional("email_verify", token, user.id);
    }

    await sendVerificationEmail(user.email, user.name, token);

    return NextResponse.json({
      message: "Verification email sent.",
    });
  } catch (error) {
    console.error("[RESEND_VERIFY]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
