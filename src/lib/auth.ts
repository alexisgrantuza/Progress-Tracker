import "server-only";

import { cookies } from "next/headers";

import type { UserProfile } from "@/types/project";

const DEMO_SESSION_COOKIE = "tracker_demo_session";

export async function getDemoSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Pick<
      UserProfile,
      "name" | "email" | "role"
    >;

    return parsed;
  } catch {
    return null;
  }
}
