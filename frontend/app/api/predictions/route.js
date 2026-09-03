import { NextResponse } from "next/server";

const ML_SERVICE_URL = (
  process.env.ML_SERVICE_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

function getPredictionContext() {
  const now = new Date();
  const sundayBasedDay = now.getDay();

  return {
    dayOfWeek: sundayBasedDay === 0 ? 7 : sundayBasedDay,
    hour: now.getHours(),
  };
}

async function predictWait(restaurant, context) {
  const response = await fetch(`${ML_SERVICE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurant_id: Number(restaurant.restaurantId),
      day_of_week: context.dayOfWeek,
      hour: context.hour,
      current_queue: Number(restaurant.currentQueue),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ML service returned ${response.status}`);
  }

  const result = await response.json();
  return {
    restaurantId: String(restaurant.restaurantId),
    estimatedWait: Number(result.estimated_wait),
  };
}

export async function POST(request) {
  try {
    const { restaurants } = await request.json();
    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      return NextResponse.json(
        { message: "ต้องระบุร้านอาหารอย่างน้อยหนึ่งร้าน" },
        { status: 400 },
      );
    }

    const context = getPredictionContext();
    const predictions = await Promise.all(
      restaurants.map((restaurant) => predictWait(restaurant, context)),
    );

    return NextResponse.json({ ...context, predictions });
  } catch {
    return NextResponse.json(
      { message: "เชื่อมต่อ AI service ไม่สำเร็จ กรุณาตรวจสอบพอร์ต 8000" },
      { status: 502 },
    );
  }
}
