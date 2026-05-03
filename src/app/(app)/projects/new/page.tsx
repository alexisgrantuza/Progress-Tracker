import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Create project"
        description="Set the schedule baseline first, then add task heads and specific tasks so the system can compute target area, completed area, and overall progress automatically."
      />
      <ProjectForm mode="create" />
    </div>
  );
}
