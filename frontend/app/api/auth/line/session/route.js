import { NextResponse } from "next/server";
import { LINE_AUTH_COOKIES, readSessionToken } from "../../../../_lib/line-auth";

export async function GET(request) {
  try {
    const token = request.cookies.get(LINE_AUTH_COOKIES.session)?.value;
    return NextResponse.json({ user: readSessionToken(token) });
  } catch {
    return NextResponse.json({ user: null });
  }
}
