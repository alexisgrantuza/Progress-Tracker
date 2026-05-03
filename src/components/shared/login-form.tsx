"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDemoSessionPayload } from "@/lib/demo-session";
import { loginSchema, type LoginFormValues } from "@/lib/validations/forms";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "paolo@tracker.local",
      role: "Supervisor",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const payload = createDemoSessionPayload({
      email: values.email,
      role: values.role,
    });

    await fetch("/api/demo-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });
    toast.success(`Signed in as ${values.role}.`);
    router.push("/dashboard");
  }

  return (
    <Card className="border-0 bg-white/95 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
      <CardHeader>
        <CardTitle className="text-2xl">Project access</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              defaultValue={form.getValues("role")}
              onValueChange={(value) => form.setValue("role", value as LoginFormValues["role"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Site Engineer">Site Engineer</SelectItem>
                <SelectItem value="QA/QC">QA/QC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Login to dashboard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
