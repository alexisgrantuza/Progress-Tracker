import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="MVP configuration"
        description="This screen summarizes the current Supabase-backed auth setup and the database scaffolding available for production data."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 bg-white/90">
          <CardHeader>
            <CardTitle>Authentication mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Current login is handled by Supabase Auth with SSR-aware clients in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.</p>
            <p>User display data is resolved on the server in `src/lib/auth.ts`, with role details pulled from the `public.users` table when available.</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/90">
          <CardHeader>
            <CardTitle>Database setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Schema SQL for the MVP tables lives in `supabase/migrations/20260502_000001_mvp_schema.sql`.</p>
            <p>Project, task, progress, and report data is loaded from Supabase Postgres through Prisma.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
