"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  FolderKanban,
  Gauge,
  HardHat,
  LayoutDashboard,
  Settings,
  X,
  Menu,
  Bell,
  ChevronRight,
  TrendingUp,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/project";

const navItems: { href: string; label: string; icon: LucideIcon; description: string }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & metrics" },
  { href: "/projects", label: "Projects", icon: FolderKanban, description: "Manage projects" },
  { href: "/progress-updates", label: "Progress Updates", icon: ClipboardList, description: "Log site progress" },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, description: "Schedule view" },
  { href: "/reports", label: "Reports", icon: Gauge, description: "Monthly reports" },
  { href: "/settings", label: "Settings", icon: Settings, description: "App settings" },
];

const roleColors: Record<string, string> = {
  "Site Engineer": "bg-slate-100 text-slate-700 border-slate-200",
  "Supervisor": "bg-slate-100 text-slate-700 border-slate-200",
  "QA/QC": "bg-slate-100 text-slate-700 border-slate-200",
};

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; role: UserRole } | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const roleClass = roleColors[user?.role ?? "Supervisor"] ?? roleColors["Supervisor"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
              <HardHat className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">BuildSight</p>
              <h2 className="font-heading text-base font-semibold leading-tight text-slate-950">
                Productivity Tracker
              </h2>
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight className="size-3.5 text-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
              <User className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name ?? "Demo User"}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  roleClass
                )}
              >
                {user?.role ?? "Supervisor"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="md:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-4 px-4 md:px-6">
            {/* Hamburger (mobile only) */}
            <button
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </button>

            {/* Page breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                <TrendingUp className="size-3.5 shrink-0 text-slate-400" />
                <span>Construction Ops</span>
                <ChevronRight className="size-3.5 text-slate-300" />
              </div>
              <span className="truncate text-sm font-semibold text-slate-900">
                {currentPage?.label ?? "Dashboard"}
              </span>
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button className="relative rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700">
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 flex size-2 rounded-full bg-slate-900" />
              </button>

              <div className="hidden h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-slate-700">
                  <User className="size-3" />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {user?.name ?? "Demo User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-3.5rem)] px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
