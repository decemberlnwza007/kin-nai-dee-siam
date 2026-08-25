import { ImageResponse } from 'next/og';

export const alt = 'กินไหนดี — ค้นหาและเปรียบเทียบร้านอาหารรอบสยาม';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        color: '#171714',
        background: '#f7f3eb',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ width: '20px', height: '54px', background: '#d8442f' }} />
        <div style={{ display: 'flex', fontSize: '36px', fontWeight: 800 }}>KIN NAI DEE · SIAM</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', maxWidth: '980px', fontSize: '84px', fontWeight: 800, lineHeight: 1.05 }}>
          SIAM RESTAURANT GUIDE
        </div>
        <div style={{ display: 'flex', fontSize: '30px', color: '#6d6a62' }}>
          Compare wait estimates, prices, ratings and directions.
        </div>
      </div>
    </div>,
    size,
  );
}
