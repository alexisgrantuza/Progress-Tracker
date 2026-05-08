import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { getProjectById } from "@/lib/data/db-data";

export default async function EditProjectPage(props: PageProps<"/projects/[id]/edit">) {
  const { id } = await props.params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title={`Edit ${project.project_name}`}
        description="Project area is a fixed baseline. Task and task-head entries update completed area and progress only."
      />
      <ProjectForm
        mode="edit"
        projectId={project.id}
        defaultValues={{
          project_name: project.project_name,
          location: project.location,
          total_target_area: project.total_target_area,
          start_date: project.start_date,
          end_date: project.end_date,
        }}
      />
    </div>
  );
}
