"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormValues } from "@/lib/validations/forms";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      toast.error("Supabase is not configured. Add the project URL and publishable key to continue.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully.");
    startTransition(() => {
      router.replace("/dashboard");
      router.refresh();
    });
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
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
          </div>
          {form.formState.errors.password ? (
            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending || form.formState.isSubmitting}>
            {isPending || form.formState.isSubmitting ? "Signing in..." : "Login to dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
