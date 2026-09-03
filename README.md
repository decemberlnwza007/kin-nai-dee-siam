# กินไหนดี — Siam Queue Guide

Next.js prototype สำหรับเปรียบเทียบเวลารอ ราคา ความคุ้ม และเข้าคิวร้านอาหารรอบสยาม

## Development

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Production

```bash
npm run build
npm start
```

ข้อมูลร้านและคิวทั้งหมดเป็นข้อมูลตัวอย่างสำหรับ prototype

## Project structure

```text
app/
├── _components/   # Client UI และหน้าจอต่าง ๆ
├── _data/         # ข้อมูลตัวอย่างและตัวเลือกคงที่
├── _lib/          # ฟังก์ชันคำนวณและจัดรูปแบบข้อมูล
├── globals.css    # Design tokens และ global styles
├── layout.js      # Metadata และ root layout
└── page.js        # Route หลักที่ประกอบแอป
public/assets/     # รูปภาพที่ใช้งานบนเว็บไซต์
```

โฟลเดอร์ที่ขึ้นต้นด้วย `_` เป็น private folders ของ App Router และไม่สร้าง URL route เพิ่ม
