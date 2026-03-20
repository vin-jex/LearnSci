import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className='min-h-screen bg-ink-950'>
      <DashboardNav user={session.user} />
      <main className='max-w-4xl mx-auto px-4 sm:px-6 py-10'>{children}</main>
    </div>
  );
}
