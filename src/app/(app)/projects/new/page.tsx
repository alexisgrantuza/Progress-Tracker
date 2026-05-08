import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Create project"
        description="Set the fixed project area and schedule baseline first, then add task heads and specific tasks to track completed area and productivity progress."
      />
      <ProjectForm mode="create" />
    </div>
  );
}
