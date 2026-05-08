import { PageHeader } from "@/components/shared/page-header";
import { ProjectCalendar } from "@/components/calendar/project-calendar";
import { getAppDataset } from "@/lib/data/db-data";

export default async function CalendarPage() {
  const dataset = await getAppDataset();

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        eyebrow="Schedule"
        title="Schedule Calendar"
        description="Color-coded task schedules highlight which packages are on track, at risk, delayed, critical, completed, or facing labor productivity issues."
      />
      <ProjectCalendar projects={dataset.projects} />
    </div>
  );
}
