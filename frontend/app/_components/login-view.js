"use client";

import Image from "next/image";

function LineMark() {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-black tracking-[-.04em] text-[#06c755]">LINE</span>;
}

export default function LoginView({ user, isLoading, onLogout }) {
  if (isLoading) {
    return <section className="grid min-h-[calc(100dvh-138px)] place-items-center px-5"><p className="font-semibold text-muted" role="status">กำลังตรวจสอบการเข้าสู่ระบบ…</p></section>;
  }

  if (user) {
    return (
      <section className="mx-auto min-h-[calc(100dvh-138px)] max-w-[720px] px-5 py-12 min-[900px]:min-h-[calc(100vh-150px)] min-[900px]:py-20">
        <div className="border-y border-ink py-10 text-center min-[900px]:py-14">
          {user.picture ? (
            <img src={user.picture} alt={`รูปโปรไฟล์ของ ${user.name}`} className="mx-auto h-20 w-20 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-leaf-soft text-3xl font-bold uppercase text-leaf">{user.name.slice(0, 1)}</div>
          )}
          <p className="mt-6 text-xs font-extrabold tracking-[.14em] text-[#06a846]">CONNECTED WITH LINE</p>
          <h1 className="mt-2 text-[32px] font-bold tracking-[-.025em] min-[900px]:text-[46px]">สวัสดี {user.name}</h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-muted">บัญชีของคุณพร้อมสำหรับเก็บร้านโปรด ประวัติการเปรียบเทียบ และคิวในขั้นต่อไป</p>
          <button type="button" onClick={onLogout} className="mt-8 min-h-12 rounded-xl border border-ink px-6 py-3 font-bold transition-colors hover:bg-ink hover:text-white">ออกจากระบบ</button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid min-h-[calc(100dvh-138px)] min-[900px]:min-h-[calc(100vh-150px)] min-[900px]:grid-cols-[minmax(420px,.9fr)_minmax(0,1.1fr)] min-[900px]:items-stretch">
      <div className="flex items-center px-5 py-10 min-[900px]:px-12 min-[1100px]:px-20">
        <div className="mx-auto w-full max-w-[440px]">
          <p className="text-xs font-extrabold tracking-[.14em] text-chilli">MEMBER</p>
          <h1 className="mt-3 max-w-[10ch] text-[38px] font-bold leading-[1.08] tracking-[-.03em] min-[900px]:text-[56px]">กลับมาเลือกมื้อที่คุ้มกัน</h1>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted">เข้าสู่ระบบด้วยบัญชี LINE ที่คุณใช้อยู่แล้ว ไม่ต้องสร้างหรือจำรหัสผ่านใหม่</p>
          <a href="/api/auth/line/login" className="mt-9 flex min-h-14 w-full items-center gap-4 rounded-xl bg-[#06c755] p-2 pr-5 font-bold text-white no-underline transition-colors hover:bg-[#05b64e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06c755]">
            <LineMark /><span className="flex-1 text-center">เข้าสู่ระบบด้วย LINE</span>
          </a>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs leading-relaxed text-muted">ระบบจะพาคุณไปยืนยันตัวตนที่ LINE และรับเฉพาะชื่อกับรูปโปรไฟล์ เว็บไซต์นี้จะไม่เห็นรหัสผ่าน LINE ของคุณ</p>
          </div>
        </div>
      </div>
      <div className="relative hidden min-h-[680px] overflow-hidden bg-ink min-[900px]:block">
        <Image src="/assets/baan-ying-siam-center.jpg" alt="อาหารไทยสำหรับมื้อพิเศษ" fill priority sizes="55vw" className="object-cover opacity-75" />
        <div className="absolute inset-x-0 bottom-0 bg-black/65 p-10 text-white min-[1100px]:p-14">
          <p className="max-w-[18ch] text-[32px] font-bold leading-tight tracking-[-.025em] min-[1100px]:text-[42px]">รอน้อยลง เลือกได้มั่นใจขึ้น</p>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-[#e9e4da]">เข้าสู่ระบบครั้งเดียว เพื่อเตรียมเก็บร้านโปรดและดูคิวของคุณได้ในที่เดียว</p>
        </div>
      </div>
    </section>
  );
}
