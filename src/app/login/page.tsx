import { redirect } from "next/navigation";
import { BarChart3, ClipboardCheck, HardHat } from "lucide-react";

import { LoginForm } from "@/components/shared/login-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_28%),linear-gradient(135deg,_#fff7ed_0%,_#ffffff_42%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            Construction SaaS MVP
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-tight tracking-tight text-slate-950">
              Labor productivity and progress visibility built for field decisions.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Monitor target area, actual output, weekly warnings, monthly critical tasks, and manpower performance in one operating view for supervisors, site engineers, and QA/QC teams.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-orange-100/40">
              <HardHat className="size-6 text-orange-600" />
              <p className="mt-4 font-medium text-slate-950">Secure sign-in</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Email and password authentication backed by your Supabase project.</p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-orange-100/40">
              <BarChart3 className="size-6 text-orange-600" />
              <p className="mt-4 font-medium text-slate-950">Output tracking</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Automatic progress and productivity checks from actual completed area.</p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-orange-100/40">
              <ClipboardCheck className="size-6 text-orange-600" />
              <p className="mt-4 font-medium text-slate-950">Supervisor workflow</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Calendar, updates, reports, and warning boards tuned for site monitoring.</p>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
