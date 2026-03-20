import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Total published topics
    const topicCount = await prisma.topic.count({
      where: { published: true },
    });

    // All attempts by this user
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { score: true, topicId: true, createdAt: true },
    });

    // Quizzes completed = number of distinct topics attempted
    const quizzesCompleted = new Set(attempts.map((a) => a.topicId)).size;

    // Average score across all attempts
    const avgScore =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length,
          )
        : null;

    // Streak = number of consecutive days (ending today) with at least one attempt
    const streak = calculateStreak(attempts.map((a) => a.createdAt));

    return NextResponse.json({
      topicCount,
      quizzesCompleted,
      avgScore,
      streak,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  // Normalise each date to YYYY-MM-DD string in UTC
  const days = new Set(dates.map((d) => d.toISOString().slice(0, 10)));

  const today = new Date();
  let streak = 0;
  const cursor = new Date(today);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
