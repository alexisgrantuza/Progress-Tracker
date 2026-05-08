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
import { deleteTask, deleteTaskHead } from "@/lib/actions";

type DeleteKind = "task" | "task head";

export function DeleteConfirmationButton({
  id,
  name,
  kind,
  childCount = 0,
  size = "sm",
}: {
  id: string;
  name: string;
  kind: DeleteKind;
  childCount?: number;
  size?: "xs" | "sm";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasChildren = kind === "task head" && childCount > 0;

  function handleDelete() {
    startTransition(async () => {
      const result = kind === "task" ? await deleteTask(id) : await deleteTaskHead(id);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(`${kind === "task" ? "Task" : "Task head"} "${name}" deleted.`);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size={size}
          className="gap-1.5"
          aria-label={`Delete ${kind} ${name}`}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {kind}?</DialogTitle>
          <DialogDescription>
            This will permanently delete <span className="font-semibold text-slate-700">{name}</span>.
            {hasChildren
              ? ` It will also delete ${childCount} specific task${childCount === 1 ? "" : "s"} and their progress updates.`
              : kind === "task"
                ? " Its progress updates will also be deleted."
                : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
