import './globals.css';

export const metadata = {
  title: 'กินไหนดี — Siam Queue Guide',
  description: 'เช็กคิว เปรียบเทียบความคุ้ม และเลือกร้านอาหารรอบสยาม',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7f3eb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
