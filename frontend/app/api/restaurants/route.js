import { NextResponse } from "next/server";

import { fetchBackend } from "../../_lib/backend";

export async function GET() {
  try {
    const { data, status } = await fetchBackend("/api/restaurants");
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json(
      { message: "เชื่อมต่อ backend ไม่สำเร็จ กรุณาตรวจสอบว่าพอร์ต 8080 เปิดอยู่" },
      { status: 502 },
    );
  }
}
