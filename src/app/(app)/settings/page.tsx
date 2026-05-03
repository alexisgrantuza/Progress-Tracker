import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="MVP configuration"
        description="This screen summarizes the runtime setup for demo mode and the Supabase integration points prepared for production wiring."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 bg-white/90">
          <CardHeader>
            <CardTitle>Authentication mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Current MVP login uses a lightweight demo session cookie so supervisors and engineers can enter the dashboard immediately.</p>
            <p>Production hookup is prepared through `@supabase/ssr` in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/90">
          <CardHeader>
            <CardTitle>Database setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Schema SQL for the MVP tables lives in `supabase/migrations/20260502_000001_mvp_schema.sql`.</p>
            <p>Seeded construction data is loaded from `src/lib/data/sample-data.ts` so UI flows are testable before connecting a real database.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
