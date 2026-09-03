import { NextResponse } from "next/server";

import { getAdminUserFromRequest } from "../../../_lib/admin-auth";
import { fetchBackend } from "../../../_lib/backend";

function unauthorized() {
  return NextResponse.json({ message: "ไม่มีสิทธิ์ใช้งานระบบหลังบ้าน" }, { status: 403 });
}

export async function GET(request) {
  if (!getAdminUserFromRequest(request)) return unauthorized();

  try {
    const { data, status } = await fetchBackend("/api/restaurants");
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ message: "เชื่อมต่อ backend ไม่สำเร็จ" }, { status: 502 });
  }
}

export async function POST(request) {
  if (!getAdminUserFromRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const { data, status } = await fetchBackend("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ message: "เพิ่มร้านอาหารไม่สำเร็จ" }, { status: 502 });
  }
}
