import { NextResponse } from "next/server";

import { fetchBackend } from "../../../../_lib/backend";
import {
  LINE_AUTH_COOKIES,
  readSessionToken,
} from "../../../../_lib/line-auth";

export async function POST(request, { params }) {
  try {
    const sessionToken = request.cookies.get(LINE_AUTH_COOKIES.session)?.value;
    const user = readSessionToken(sessionToken);

    if (!user) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบด้วย LINE ก่อนเข้าคิว" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { data, status } = await fetchBackend(
      `/api/restaurants/${encodeURIComponent(id)}/queue`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json(
      { message: "ส่งข้อมูลคิวไปยัง backend ไม่สำเร็จ" },
      { status: 502 },
    );
  }
}
