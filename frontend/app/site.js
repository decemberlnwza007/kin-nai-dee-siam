const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "กินไหนดี",
  url: rawSiteUrl.replace(/\/$/, ""),
  description:
    "ค้นหาร้านอาหารรอบสยามสแควร์ เช็กเวลารอโดยประมาณ เปรียบเทียบราคา คะแนน และความคุ้ม พร้อมเปิดเส้นทางไปยังร้านผ่าน Google Maps",
};
