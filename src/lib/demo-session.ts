import type { UserRole } from "@/types/project";

export function createDemoSessionPayload(input: {
  email: string;
  role: UserRole;
  name?: string;
}) {
  return encodeURIComponent(
    JSON.stringify({
      name: input.name ?? input.email.split("@")[0],
      email: input.email,
      role: input.role,
    }),
  );
}
