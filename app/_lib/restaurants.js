const MATCH_WEIGHTS = {
  balanced: [0.32, 0.25, 0.2, 0.23],
  fast: [0.58, 0.16, 0.12, 0.14],
  value: [0.22, 0.5, 0.1, 0.18],
  taste: [0.18, 0.12, 0.55, 0.15],
};

export function formatMoney(value) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export function getWaitLabel(minutes) {
  if (minutes <= 10) return "คิวน้อย";
  if (minutes >= 35) return "คิวยาว";
  return `รอประมาณ ${minutes} นาที`;
}

export function getMapUrl(restaurant) {
  const destination = `${restaurant.name} Siam Square Bangkok`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getMealMatch(restaurant, preference) {
  const waitFit = Math.max(
    0,
    100 - Math.max(0, restaurant.wait - preference.time) * 5,
  );
  const budgetFit = Math.max(
    0,
    100 - Math.max(0, restaurant.price - preference.budget) * 0.45,
  );
  const tasteFit = restaurant.rating * 20;
  const valueFit = restaurant.worth;
  const weights = MATCH_WEIGHTS[preference.priority];
  const score = Math.round(
    waitFit * weights[0] +
      budgetFit * weights[1] +
      tasteFit * weights[2] +
      valueFit * weights[3],
  );

  let reason = "สมดุลกับเวลาและงบของคุณ";
  if (
    restaurant.wait <= preference.time &&
    restaurant.price <= preference.budget
  ) {
    reason = "ทันเวลาและไม่เกินงบ";
  } else if (restaurant.wait <= preference.time) {
    reason = "ได้กินทันเวลาที่ตั้งไว้";
  } else if (restaurant.price <= preference.budget) {
    reason = "ราคาอยู่ในงบที่ตั้งไว้";
  }

  return {
    score: Math.max(0, Math.min(99, score)),
    reason,
  };
}
