// app/admin/page.tsx
import { redirect } from "next/navigation";

// Redirect /admin to /admin/topics
export default function AdminPage() {
  redirect("/admin/topics");
}
