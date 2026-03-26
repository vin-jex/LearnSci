import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { storeTokenBidirectional, getExistingToken } from "@/lib/redis";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    let token = await getExistingToken("password_reset", user.id);

    if (!token) {
      token = randomBytes(32).toString("hex");
      await storeTokenBidirectional("password_reset", token, user.id);
    }

    try {
      await sendPasswordResetEmail(email, user.name, token);
    } catch (emailError) {
      console.error("[FORGOT_PASSWORD_EMAIL_FAILED]", {
        email,
        userId: user.id,
        error: emailError,
      });

      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_FATAL]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
