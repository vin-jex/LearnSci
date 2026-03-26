import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SELECT_FIELDS = {
  id: true,
  title: true,
  titleIgbo: true,
  description: true,
  descriptionIgbo: true,
  duration: true,
} as const;

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
      const topics = await prisma.topic.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: SELECT_FIELDS,
      });
      return NextResponse.json({ topics, personalised: false });
    }

    const recommendedIds = profile.recommendedTopics as string[];

    const topics = await prisma.topic.findMany({
      where: { published: true, id: { in: recommendedIds } },
      select: SELECT_FIELDS,
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
