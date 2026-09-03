import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  LINE_AUTH_COOKIES,
  readSessionToken,
} from "../../../_lib/line-auth";

export async function POST(request) {
  let user;
  try {
    const sessionToken = request.cookies.get(LINE_AUTH_COOKIES.session)?.value;
    user = readSessionToken(sessionToken);
  } catch {
    return NextResponse.json(
      { message: "ระบบแจ้งเตือน LINE ยังตั้งค่าไม่ครบ" },
      { status: 503 },
    );
  }

  if (!user) {
    return NextResponse.json(
      { message: "กรุณาเข้าสู่ระบบด้วย LINE ก่อนเปิดการแจ้งเตือน" },
      { status: 401 },
    );
  }

  const channelAccessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
  if (!channelAccessToken) {
    return NextResponse.json(
      { message: "ยังไม่ได้ตั้งค่า Messaging API Channel Access Token" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const queueNumber = String(body.queueNumber ?? "").slice(0, 20);
  const restaurantName = String(body.restaurantName ?? "").slice(0, 100);
  const ahead = Math.max(0, Math.min(999, Number(body.ahead) || 0));
  const allowedKinds = new Set(["confirmed", "almost-ready", "cancelled"]);
  const kind = allowedKinds.has(body.kind) ? body.kind : "almost-ready";

  if (!queueNumber || !restaurantName) {
    return NextResponse.json(
      { message: "ข้อมูลคิวไม่ครบถ้วน" },
      { status: 400 },
    );
  }

  const variants = {
    confirmed: {
      accent: "#23745A",
      badge: "จองสำเร็จ",
      emoji: "✓",
      headline: "รับคิวเรียบร้อยแล้ว",
      description: "พักสบาย ๆ ได้เลย เราจะแจ้งอีกครั้งเมื่อใกล้ถึงคิว",
      altText: `จองคิว ${restaurantName} สำเร็จ หมายเลข ${queueNumber}`,
    },
    "almost-ready": {
      accent: "#D8442F",
      badge: "ใกล้ถึงคิว",
      emoji: "!",
      headline: "เตรียมกลับไปที่ร้านได้เลย",
      description: `เหลืออีกเพียง ${ahead} กลุ่มก่อนถึงคิวของคุณ`,
      altText: `ใกล้ถึงคิว ${restaurantName} แล้ว เหลือ ${ahead} กลุ่ม`,
    },
    cancelled: {
      accent: "#6D6A62",
      badge: "ยกเลิกแล้ว",
      emoji: "×",
      headline: "ยกเลิกคิวเรียบร้อย",
      description: "คิวนี้ถูกนำออกจากรายการของคุณแล้ว",
      altText: `ยกเลิกคิว ${restaurantName} หมายเลข ${queueNumber} แล้ว`,
    },
  };
  const variant = variants[kind];

  const flexMessage = {
    type: "flex",
    altText: variant.altText,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "horizontal",
        alignItems: "center",
        paddingAll: "20px",
        backgroundColor: variant.accent,
        contents: [
          {
            type: "text",
            text: variant.emoji,
            size: "xl",
            weight: "bold",
            color: "#FFFFFF",
            flex: 0,
          },
          {
            type: "text",
            text: variant.badge,
            size: "sm",
            weight: "bold",
            color: "#FFFFFF",
            margin: "md",
          },
          {
            type: "text",
            text: "กินไหนดี · SIAM",
            size: "xs",
            color: "#FFFFFFCC",
            align: "end",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "22px",
        backgroundColor: "#FFFDF8",
        contents: [
          {
            type: "text",
            text: `สวัสดี คุณ${user.name}`,
            size: "xs",
            color: "#6D6A62",
          },
          {
            type: "text",
            text: variant.headline,
            size: "xl",
            weight: "bold",
            color: "#171714",
            wrap: true,
            margin: "sm",
          },
          {
            type: "text",
            text: restaurantName,
            size: "sm",
            weight: "bold",
            color: variant.accent,
            wrap: true,
            margin: "md",
          },
          {
            type: "separator",
            color: "#DED8CB",
            margin: "xl",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "xl",
            spacing: "md",
            contents: [
              {
                type: "box",
                layout: "vertical",
                backgroundColor: "#F3EFE7",
                cornerRadius: "12px",
                paddingAll: "14px",
                contents: [
                  { type: "text", text: "หมายเลขคิว", size: "xs", color: "#6D6A62" },
                  { type: "text", text: queueNumber, size: "xxl", weight: "bold", color: "#171714", margin: "xs" },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                backgroundColor: "#F3EFE7",
                cornerRadius: "12px",
                paddingAll: "14px",
                contents: [
                  { type: "text", text: kind === "cancelled" ? "สถานะ" : "คิวก่อนหน้า", size: "xs", color: "#6D6A62" },
                  { type: "text", text: kind === "cancelled" ? "ยกเลิก" : `${ahead} กลุ่ม`, size: "lg", weight: "bold", color: variant.accent, margin: "sm" },
                ],
              },
            ],
          },
          {
            type: "text",
            text: variant.description,
            size: "sm",
            color: "#6D6A62",
            wrap: true,
            margin: "xl",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "14px",
        backgroundColor: "#F3EFE7",
        contents: [
          {
            type: "text",
            text: "SMART QUEUE · แจ้งเตือนอัตโนมัติ",
            size: "xxs",
            color: "#8A857B",
            align: "center",
          },
        ],
      },
    },
  };

  const lineResponse = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${channelAccessToken}`,
      "Content-Type": "application/json",
      "X-Line-Retry-Key": randomUUID(),
    },
    body: JSON.stringify({
      to: user.id,
      messages: [flexMessage],
    }),
    cache: "no-store",
  });

  if (!lineResponse.ok) {
    const error = await lineResponse.text();
    console.error("LINE push message failed:", lineResponse.status, error);
    const message =
      lineResponse.status === 401
        ? "Messaging API token ใช้ไม่ได้ กรุณาออก Channel Access Token ใหม่ (ไม่ใช่ Channel Secret)"
        : "ส่งแจ้งเตือน LINE ไม่สำเร็จ กรุณาตรวจสอบว่าเพิ่มบัญชีเป็นเพื่อนแล้ว";
    return NextResponse.json(
      { message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
