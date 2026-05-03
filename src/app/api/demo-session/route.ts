import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { payload } = (await request.json()) as { payload?: string };

  if (!payload) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("tracker_demo_session", payload, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
