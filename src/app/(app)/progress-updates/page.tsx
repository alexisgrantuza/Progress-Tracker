import { PageHeader } from "@/components/shared/page-header";
import { ProgressUpdateForm } from "@/components/progress/progress-update-form";
import { getAppDataset } from "@/lib/data/sample-data";

export default function ProgressUpdatesPage() {
  const dataset = getAppDataset();

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        eyebrow="Progress Updates"
        title="Log Completed Area"
        description="Supervisors enter actual completed area only. The system computes progress percentage and surfaces weekly or monthly schedule risk automatically."
      />
      <ProgressUpdateForm tasks={dataset.tasks} />
    </div>
  );
}
