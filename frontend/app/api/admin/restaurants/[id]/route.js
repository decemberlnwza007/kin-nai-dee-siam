import { NextResponse } from "next/server";

import { getAdminUserFromRequest } from "../../../../_lib/admin-auth";
import { fetchBackend } from "../../../../_lib/backend";

function unauthorized() {
  return NextResponse.json({ message: "ไม่มีสิทธิ์ใช้งานระบบหลังบ้าน" }, { status: 403 });
}

async function forward(request, params, method) {
  if (!getAdminUserFromRequest(request)) return unauthorized();

  try {
    const { id } = await params;
    let backendPath = `/api/restaurants/${encodeURIComponent(id)}`;
    const options = { method };
    if (method === "PUT") {
      const body = await request.json();
      backendPath = "/api/restaurants";
      options.method = "POST";
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify({ ...body, id: Number(id) });
    }
    const { data, status } = await fetchBackend(backendPath, options);
    return status === 204
      ? new NextResponse(null, { status })
      : NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ message: "จัดการข้อมูลร้านไม่สำเร็จ" }, { status: 502 });
  }
}

export async function PUT(request, { params }) {
  return forward(request, params, "PUT");
}

export async function DELETE(request, { params }) {
  return forward(request, params, "DELETE");
}
