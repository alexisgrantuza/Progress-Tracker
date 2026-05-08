import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import type { UserProfile } from "@/types/project";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_ROLE: UserProfile["role"] = "Supervisor";

function isUserRole(value: unknown): value is UserProfile["role"] {
  return value === "Admin" || value === "Supervisor" || value === "Site Engineer" || value === "QA/QC";
}

function getUserName(email: string | undefined, fallback = "Tracker User") {
  if (!email) {
    return fallback;
  }

  const [localPart] = email.split("@");

  if (!localPart) {
    return fallback;
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export const getCurrentUser = cache(async (): Promise<Pick<UserProfile, "id" | "name" | "email" | "role"> | null> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const profile = await prisma.user
    .findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    .catch(() => null);

  const metadataRole = user.user_metadata.role;
  const profileRole = profile?.role;

  return {
    id: profile?.id ?? user.id,
    name: profile?.name ?? user.user_metadata.name ?? getUserName(user.email),
    email: profile?.email ?? user.email,
    role: isUserRole(profileRole) ? profileRole : isUserRole(metadataRole) ? metadataRole : DEFAULT_ROLE,
  };
});

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireCurrentUserProfile() {
  const user = await requireCurrentUser();

  return prisma.user.upsert({
    where: { email: user.email },
    create: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    update: {
      name: user.name,
      role: user.role,
    },
  });
}
