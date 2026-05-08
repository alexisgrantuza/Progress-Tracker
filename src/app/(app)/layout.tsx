import { AppShell } from "@/components/layout/app-shell";
import { requireCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  return <AppShell user={user}>{children}</AppShell>;
}
