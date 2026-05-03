import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { getProjectById } from "@/lib/data/sample-data";

export default async function EditProjectPage(props: PageProps<"/projects/[id]/edit">) {
  const { id } = await props.params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title={`Edit ${project.project_name}`}
        description="Derived totals remain read-only and continue to roll up from task-head and task-level progress."
      />
      <ProjectForm
        mode="edit"
        defaultValues={{
          project_name: project.project_name,
          location: project.location,
          start_date: project.start_date,
          end_date: project.end_date,
          created_by: project.created_by,
        }}
      />
    </div>
  );
}
