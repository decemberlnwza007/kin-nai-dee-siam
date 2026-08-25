"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Footer({ onNavigate, hasQueue }) {
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const detailDialogRef = useRef(null);
  const detailCloseButtonRef = useRef(null);
  const memberButtonRefs = useRef([]);
  const lastSelectedMemberIndexRef = useRef(0);

  const links = [
    { id: "home", label: "ค้นหาร้าน" },
    { id: "compare", label: "เปรียบเทียบ" },
    { id: "queue", label: hasQueue ? "ดูคิวของฉัน" : "ทดลองเข้าคิว" },
  ];

  const members = [
    {
      name: "ชื่อสมาชิกคนที่ 1",
      studentId: "รหัสนักศึกษา 69130500020",
      photo: "/assets/member-placeholder.svg",
    },
    {
      name: "ชื่อสมาชิกคนที่ 2",
      studentId: "รหัสนักศึกษา",
      photo: "/assets/member-placeholder.svg",
    },
    {
      name: "ชื่อสมาชิกคนที่ 3",
      studentId: "รหัสนักศึกษา",
      photo: "/assets/member-placeholder.svg",
    },
    {
      name: "นายพงศกร",
      lastname: "ทองรักษ์",
      studentId: "รหัสนักศึกษา 69130500037",
      photo: "/assets/member/thanwa.jpg",
    },
    {
      name: "ชื่อสมาชิกคนที่ 5",
      studentId: "รหัสนักศึกษา",
      photo: "/assets/member-placeholder.svg",
    },
    {
      name: "ชื่อสมาชิกคนที่ 6 ",
      studentId: "รหัสนักศึกษา",
      photo: "/assets/member-placeholder.svg",
    },
  ];

  useEffect(() => {
    if (!showMembers) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (selectedMember) {
          setSelectedMember(null);
        } else {
          setShowMembers(false);
        }
      }

      const activeDialog = selectedMember
        ? detailDialogRef.current
        : dialogRef.current;

      if (event.key === "Tab" && activeDialog) {
        const focusable = activeDialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    if (!selectedMember) {
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMembers, selectedMember]);

  useEffect(() => {
    if (!showMembers) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      openButtonRef.current?.focus();
    };
  }, [showMembers]);

  useEffect(() => {
    if (selectedMember) {
      window.requestAnimationFrame(() => detailCloseButtonRef.current?.focus());
      return;
    }

    if (showMembers && memberButtonRefs.current.length) {
      memberButtonRefs.current[lastSelectedMemberIndexRef.current]?.focus();
    }
  }, [selectedMember, showMembers]);

  return (
    <>
      <footer className="border-t border-ink bg-ink text-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-10 min-[760px]:grid-cols-[1.25fr_.75fr] min-[900px]:px-0 min-[900px]:py-12">
          <div>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl">กินไหนดี</strong>

              <span className="text-[10px] font-bold tracking-[.16em] text-[#f29a89]">
                SIAM
              </span>
            </div>

            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-[#d5d1c8]">
              ช่วยเลือกร้านรอบสยามจากเวลาที่มี งบ
              และสิ่งที่คุณให้ความสำคัญ พร้อมเปรียบเทียบก่อนตัดสินใจ
            </p>

            <p className="mt-4 text-xs text-[#aaa69d]">
              Website นี้เป็นแค่ Prototype ในวิชา{" "}
              <b>INT100 DESIGN THINKING ของ อาจารย์สยาม แย้มแสงสังข์</b>
            </p>

            <p className="mt-4 text-xs text-[#aaa69d]">
              Prototype นี้จัดทำโดย

              <b className="mt-3 block text-lg leading-relaxed text-white">
                นักศึกษาชั้นปีที่ 1 คณะเทคโนโลยีสารสนเทศ
                มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Section A กลุ่ม G1-08
              </b>
            </p>

            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setShowMembers(true)}
              className="mt-4 inline-flex min-h-10 items-center gap-2 border-b border-[#f29a89]/60 pb-1 text-sm font-semibold text-[#f29a89] transition hover:border-[#f29a89] hover:text-white"
            >
              สมาชิกในกลุ่ม
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav
            aria-label="ลิงก์ท้ายเว็บไซต์"
            className="min-[760px]:justify-self-end"
          >
            <p className="mb-3 text-xs font-bold tracking-[.08em] text-[#aaa69d]">
              ไปต่ออย่างรวดเร็ว
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3 min-[760px]:max-w-[260px]">
              {links.map((link) => (
                <button
                  key={link.id}
                  className="min-h-11 border-b border-white/35 bg-transparent py-2 text-left text-sm font-semibold transition-colors hover:border-chilli hover:text-[#f29a89]"
                  onClick={() => onNavigate(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="border-t border-white/15 px-5 py-4 text-center text-xs text-[#aaa69d]">
          © 2026 กินไหนดี · Prototype สำหรับร้านอาหารย่านสยาม
        </div>
      </footer>

      {showMembers && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-3 backdrop-blur-[3px] motion-safe:[animation:member-backdrop-in_.22s_ease-out_both] min-[600px]:items-center min-[600px]:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMembers(false);
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
            aria-hidden={selectedMember ? "true" : undefined}
            inert={selectedMember ? true : undefined}
            className="relative max-h-[min(88dvh,760px)] w-full max-w-[820px] overflow-y-auto rounded-2xl bg-[#f3efe7] text-[#1f1e1a] shadow-[0_24px_80px_rgba(0,0,0,.35)] motion-safe:[animation:member-modal-in_.42s_cubic-bezier(.16,1,.3,1)_both]"
          >
            <div className="border-b border-black/10 px-6 pb-5 pt-6 min-[600px]:px-8 min-[600px]:pt-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b65343]">
                    G1-08
                  </p>

                  <h2
                    id="member-modal-title"
                    className="mt-2 text-2xl font-bold tracking-[-.03em] min-[600px]:text-3xl"
                  >
                    สมาชิกในกลุ่ม
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-[#716d64]">
                    นักศึกษาชั้นปีที่ 1 คณะเทคโนโลยีสารสนเทศ
                    มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="ปิดหน้าต่างสมาชิกในกลุ่ม"
                  onClick={() => setShowMembers(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/50 transition-colors hover:bg-white [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 min-[600px]:px-8 min-[600px]:py-7">
              <div className="grid gap-3 min-[600px]:grid-cols-2">
                {members.map((member, index) => (
                  <button
                    key={`${member.name}-${index}`}
                    ref={(node) => {
                      memberButtonRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => {
                      lastSelectedMemberIndexRef.current = index;
                      setSelectedMember({ ...member, index });
                    }}
                    aria-label={`ดูข้อมูลของ ${member.name}`}
                    className="group grid w-full grid-cols-[76px_minmax(0,1fr)_24px] items-center gap-4 rounded-2xl bg-white/65 p-3 text-left transition-colors hover:bg-white motion-safe:[animation:member-card-in_.38s_cubic-bezier(.16,1,.3,1)_both] min-[600px]:grid-cols-[92px_minmax(0,1fr)_24px] min-[600px]:p-4"
                    style={{ animationDelay: `${100 + index * 55}ms` }}
                  >
                    <Image
                      className="aspect-square w-full rounded-xl bg-[#e3ddd2] object-cover"
                      src={member.photo}
                      width={184}
                      height={184}
                      alt={`รูปสมาชิก ${member.name}`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[10px] font-bold tracking-[.12em] text-[#b65343]">
                        MEMBER {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="font-semibold leading-snug">
                        {member.name}
                      </p>

                      <p className="mt-1 text-xs text-[#858077]">
                        {member.studentId}
                      </p>
                    </div>

                    <svg
                      className="h-5 w-5 fill-none stroke-[#8c877e] stroke-2 transition-transform group-hover:translate-x-0.5 group-hover:stroke-[#d8442f]"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-black/10 bg-[#e9e3d9] px-6 py-4 min-[600px]:px-8">
              <p className="text-xs text-[#777168]">
                INT100 · Design Thinking
              </p>

              <button
                type="button"
                onClick={() => setShowMembers(false)}
                className="rounded-full bg-[#211f1a] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {showMembers && selectedMember && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/72 p-3 backdrop-blur-[5px] motion-safe:[animation:member-backdrop-in_.18s_ease-out_both] min-[600px]:items-center min-[600px]:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <div
            ref={detailDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-detail-title"
            className="relative grid max-h-[90dvh] w-full max-w-[720px] overflow-y-auto rounded-2xl bg-[#fffdf8] text-[#1f1e1a] shadow-[0_28px_90px_rgba(0,0,0,.42)] motion-safe:[animation:member-detail-in_.4s_cubic-bezier(.16,1,.3,1)_both] min-[660px]:grid-cols-[.9fr_1.1fr]"
          >
            <div className="relative min-h-[280px] overflow-hidden bg-[#e3ddd2] min-[660px]:min-h-[520px]">
              <Image
                src={selectedMember.photo}
                alt={`รูปสมาชิก ${selectedMember.name}`}
                fill
                sizes="(max-width: 659px) 100vw, 320px"
                className="object-cover"
              />

              <span className="absolute bottom-4 left-4 bg-[#171714] px-3 py-1.5 text-xs font-bold tracking-[.08em] text-white">
                สมาชิก {String(selectedMember.index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex min-h-[320px] flex-col p-6 min-[660px]:p-8">
              <div className="flex items-start justify-between gap-5">
                <h2
                  id="member-detail-title"
                  className="max-w-[12ch] text-2xl font-bold leading-tight tracking-[-.03em] min-[660px]:text-3xl"
                >
                  {selectedMember.name}
                  <br />
                  {selectedMember.lastname}
                </h2>

                <button
                  ref={detailCloseButtonRef}
                  type="button"
                  aria-label="ปิดข้อมูลสมาชิก"
                  onClick={() => setSelectedMember(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-[#f0e9dd] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <dl className="mt-8 border-y border-black/10">
                <div className="grid grid-cols-[112px_1fr] gap-4 py-4">
                  <dt className="text-sm text-[#716d64]">รหัสนักศึกษา</dt>
                  <dd className="font-semibold tabular-nums">{selectedMember.studentId}</dd>
                </div>
                <div className="grid grid-cols-[112px_1fr] gap-4 border-t border-black/10 py-4">
                  <dt className="text-sm text-[#716d64]">กลุ่มเรียน</dt>
                  <dd className="font-semibold">Section A · G1-08</dd>
                </div>
                <div className="grid grid-cols-[112px_1fr] gap-4 border-t border-black/10 py-4">
                  <dt className="text-sm text-[#716d64]">รายวิชา</dt>
                  <dd className="font-semibold">INT100 Design Thinking</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="mt-8 min-h-11 w-full rounded-xl bg-[#171714] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d8442f] min-[660px]:mt-auto"
              >
                กลับไปดูสมาชิกทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
