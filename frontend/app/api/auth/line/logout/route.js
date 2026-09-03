import { NextResponse } from "next/server";
import { LINE_AUTH_COOKIES } from "../../../../_lib/line-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(LINE_AUTH_COOKIES.session);
  return response;
}
