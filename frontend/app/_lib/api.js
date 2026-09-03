import { RESTAURANTS as RESTAURANT_PRESENTATION } from "../_data/restaurants";

const DEFAULT_RATINGS = {
  รสชาติ: 0,
  ราคา: 0,
  เวลารอ: 0,
  ปริมาณ: 0,
  ประสบการณ์: 0,
};

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeRestaurant(item) {
  const id = item.id ?? item.restaurantId ?? item.restaurant_id;
  const presentation =
    RESTAURANT_PRESENTATION.find((restaurant) => restaurant.name === item.name) ??
    RESTAURANT_PRESENTATION[Number(id) - 1] ??
    {};

  return {
    ...presentation,
    id: String(id),
    backendId: id,
    name: item.name ?? item.restaurantName ?? item.restaurant_name ?? "ร้านอาหาร",
    location: item.location ?? presentation.location ?? "สยามสแควร์",
    totalTables: numberOr(item.totalTables ?? item.total_tables),
    averageServiceTime: numberOr(
      item.averageServiceTime ?? item.average_service_time,
    ),
    type:
      item.type ?? item.description ?? item.cuisine ?? presentation.type ?? "ร้านอาหาร",
    category: item.category ?? item.cuisine ?? presentation.category ?? "อื่น ๆ",
    wait: numberOr(
      item.wait ?? item.waitTime ?? item.wait_time ?? item.estimatedWaitTime,
      presentation.wait,
    ),
    people: numberOr(
      item.people ?? item.queueCount ?? item.queue_count,
      presentation.people,
    ),
    price: numberOr(
      item.price ?? item.averagePrice ?? item.average_price,
      presentation.price,
    ),
    rating: numberOr(item.rating, presentation.rating),
    worth: numberOr(
      item.worth ?? item.worthScore ?? item.worth_score,
      presentation.worth,
    ),
    distance: numberOr(item.distance, presentation.distance),
    popular: Boolean(item.popular ?? item.isPopular ?? presentation.popular),
    img:
      item.img ??
      item.image ??
      item.imageUrl ??
      item.image_url ??
      presentation.img ??
      "/assets/noodles.jpg",
    ratings: {
      ...DEFAULT_RATINGS,
      ...(presentation.ratings ?? {}),
      ...(item.ratings ?? {}),
    },
  };
}

export async function getRestaurants({ signal } = {}) {
  const response = await fetch("/api/restaurants", { signal });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "โหลดข้อมูลร้านอาหารไม่สำเร็จ");
  }

  const items = Array.isArray(payload) ? payload : payload.restaurants;
  if (!Array.isArray(items)) {
    throw new Error("รูปแบบข้อมูลร้านอาหารไม่ถูกต้อง");
  }

  return items.map(normalizeRestaurant);
}

export async function createQueue(restaurantId, queueCount = 23) {
  const response = await fetch(`/api/restaurants/${restaurantId}/queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queueCount }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "เข้าคิวไม่สำเร็จ");
  }

  return payload;
}

export async function getAiWaitPredictions(restaurants, { signal } = {}) {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurants: restaurants.map((restaurant) => ({
        restaurantId: restaurant.backendId,
        currentQueue: restaurant.people,
      })),
    }),
    signal,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "AI คาดการณ์เวลารอไม่สำเร็จ");
  }

  const predictions = new Map(
    payload.predictions.map((prediction) => [
      String(prediction.restaurantId),
      prediction.estimatedWait,
    ]),
  );

  return restaurants.map((restaurant) => {
    const estimatedWait = predictions.get(restaurant.id);
    if (!Number.isFinite(estimatedWait)) return restaurant;

    return {
      ...restaurant,
      wait: estimatedWait,
      aiPredicted: true,
      predictionDay: payload.dayOfWeek,
      predictionHour: payload.hour,
    };
  });
}
