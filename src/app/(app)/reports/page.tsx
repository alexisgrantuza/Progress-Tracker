import { MonthlyReportBoard } from "@/components/reports/monthly-report-board";
import { PageHeader } from "@/components/shared/page-header";
import { getAppDataset } from "@/lib/data/db-data";

export default async function ReportsPage() {
  const dataset = await getAppDataset();

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Monthly Reports"
        description="Review project summaries, delayed tasks, critical tasks, labor productivity issues, and suggested operational actions."
      />
      <MonthlyReportBoard reports={dataset.reports} />
    </div>
  );
}
