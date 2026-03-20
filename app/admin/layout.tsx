import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className='min-h-screen bg-ink-950'>
      <AdminNav userName={user.name} />
      <main className='max-w-6xl mx-auto px-4 sm:px-6 py-10'>{children}</main>
    </div>
  );
}
