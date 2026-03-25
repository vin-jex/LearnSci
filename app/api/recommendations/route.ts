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

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile?.recommendedTopics) {
      // No profile yet - return topics in default order
      const topics = await prisma.topic.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, description: true, duration: true },
      });
      return NextResponse.json({ topics, personalised: false });
    }

    const recommendedIds = profile.recommendedTopics as string[];

    const topics = await prisma.topic.findMany({
      where: { published: true, id: { in: recommendedIds } },
      select: { id: true, title: true, description: true, duration: true },
    });

    // Return in recommended order
    const ordered = recommendedIds
      .map((id) => topics.find((t) => t.id === id))
      .filter(Boolean);

    return NextResponse.json({ topics: ordered, personalised: true });
  } catch (error) {
    console.error("[RECOMMENDATIONS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
