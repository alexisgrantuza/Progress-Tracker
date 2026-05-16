"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteProject } from "@/lib/actions";

export function ProjectDeleteButton({
  projectId,
  projectName,
  taskHeadCount = 0,
  redirectToProjects = false,
  size = "sm",
  className,
}: {
  projectId: string;
  projectName: string;
  taskHeadCount?: number;
  redirectToProjects?: boolean;
  size?: "xs" | "sm";
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(`Project "${projectName}" deleted.`);
      setOpen(false);

      if (redirectToProjects) {
        router.push("/projects");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size={size}
          className={className}
          aria-label={`Delete project ${projectName}`}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            This will permanently delete <span className="font-semibold text-slate-700">{projectName}</span>.
            {taskHeadCount > 0
              ? ` It will also delete ${taskHeadCount} task head${taskHeadCount === 1 ? "" : "s"}, their tasks, progress updates, and reports.`
              : " Any linked reports will also be deleted."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Yes, delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
