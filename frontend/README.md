# กินไหนดี — Siam Queue Guide

Next.js prototype สำหรับเปรียบเทียบเวลารอ ราคา ความคุ้ม และเข้าคิวร้านอาหารรอบสยาม

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

ก่อนเปิด frontend ให้เปิด backend ที่ `http://localhost:8080` โดย frontend จะเรียก:

- `GET /api/restaurants` สำหรับรายการร้านอาหาร
- `POST /api/restaurants/:id/queue` พร้อม `{ "queueCount": 23 }` สำหรับเข้าคิว

หาก backend ใช้ URL อื่น ให้แก้ `BACKEND_URL` ใน `.env.local`

### LINE Login

1. สร้าง LINE Login channel ที่ LINE Developers Console
2. เพิ่ม Callback URL เป็น `http://localhost:3000/api/auth/line/callback`
3. ใส่ `LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET` และ `LINE_SESSION_SECRET`
   ใน `.env.local` (session secret ควรเป็นค่าสุ่มอย่างน้อย 32 ตัวอักษร)
4. สร้าง Messaging API channel ใน Provider เดียวกัน เชื่อม LINE Official Account
   กับ LINE Login channel และใส่ long-lived access token ใน
   `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN`

ระบบใช้ Authorization Code + PKCE ตรวจ `state` และ `nonce` ก่อนสร้าง session
cookie แบบ HttpOnly อายุ 7 วัน โดยไม่เก็บรหัสผ่าน LINE
เมื่อคิวเหลือ 3 กลุ่ม ระบบจะส่ง push message จาก LINE Official Account ไปหา
ผู้ใช้ที่เพิ่มบัญชีเป็นเพื่อนแล้ว

เปิด Smart Queue AI ด้วย:

```bash
cd ../ml-service
./venv/bin/uvicorn api:app --reload --port 8000
```

Frontend จะส่งรหัสร้าน วัน เวลา และจำนวนคิวปัจจุบันไปที่ `POST /predict`
จากนั้นแสดง `estimated_wait` พร้อมป้าย “AI คาดการณ์” หาก AI service ไม่พร้อม
ระบบจะกลับไปใช้เวลารอจาก Kotlin backend โดยอัตโนมัติ

## Production

```bash
npm run build
npm start
```

ข้อมูลร้านและคิวทั้งหมดเป็นข้อมูลตัวอย่างสำหรับ prototype

Backend ที่รองรับคือ Kotlin Spring Boot โปรเจกต์ `kin` โดย frontend จะใช้
`id`, `name`, `location`, `totalTables` และ `averageServiceTime` จาก API จริง
ส่วนข้อมูลที่ backend ยังไม่มี เช่น รูป ราคา และคะแนน จะใช้ข้อมูลนำเสนอใน
`app/_data/restaurants.js` เป็นค่าเสริม

## Project structure

```text
app/
├── _components/   # Client UI และหน้าจอต่าง ๆ
├── _data/         # ข้อมูลตัวอย่างและตัวเลือกคงที่
├── _lib/          # ฟังก์ชันคำนวณและจัดรูปแบบข้อมูล
├── api/           # Route handlers สำหรับเชื่อมต่อ backend
├── globals.css    # Design tokens และ global styles
├── layout.js      # Metadata และ root layout
└── page.js        # Route หลักที่ประกอบแอป
public/assets/     # รูปภาพที่ใช้งานบนเว็บไซต์
```

โฟลเดอร์ที่ขึ้นต้นด้วย `_` เป็น private folders ของ App Router และไม่สร้าง URL route เพิ่ม
