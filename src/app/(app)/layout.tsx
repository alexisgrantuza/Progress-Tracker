import { AppShell } from "@/components/layout/app-shell";
import { getDemoSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDemoSession();

  return <AppShell user={user}>{children}</AppShell>;
}
