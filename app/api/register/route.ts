import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { randomBytes } from "crypto";
import { storeTokenBidirectional } from "@/lib/redis";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const token = randomBytes(32).toString("hex");

    let user: { id: string; name: string; email: string };
    try {
      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: "LEARNER",
            emailVerified: false,
          },
          select: { id: true, name: true, email: true },
        });

        await storeTokenBidirectional("email_verify", token, created.id);

        return created;
      });

      await sendVerificationEmail(email, name, token);
    } catch (txError) {
      console.error("[REGISTER_TX]", txError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Account created. Please check your email to verify.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
