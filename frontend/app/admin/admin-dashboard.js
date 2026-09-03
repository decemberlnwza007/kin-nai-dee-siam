"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = { name: "", location: "", totalTables: 10, averageServiceTime: 5 };

export default function AdminDashboard({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadRestaurants() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/restaurants", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setRestaurants(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRestaurants(); }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function beginEdit(restaurant) {
    setEditingId(restaurant.id);
    setForm({
      name: restaurant.name,
      location: restaurant.location,
      totalTables: restaurant.totalTables,
      averageServiceTime: restaurant.averageServiceTime,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const url = editingId ? `/api/admin/restaurants/${editingId}` : "/api/admin/restaurants";
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim(),
          totalTables: Number(form.totalTables),
          averageServiceTime: Number(form.averageServiceTime),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "บันทึกไม่สำเร็จ");
      setMessage(editingId ? "แก้ไขข้อมูลร้านแล้ว" : "เพิ่มร้านอาหารแล้ว");
      resetForm();
      await loadRestaurants();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh bg-paper px-5 py-8 text-ink min-[900px]:px-10 min-[900px]:py-12">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-ink pb-6">
          <div><p className="text-xs font-extrabold tracking-[.16em] text-chilli">ADMIN · SIAM</p><h1 className="mt-2 text-4xl font-bold tracking-[-.03em] min-[700px]:text-5xl">จัดการร้านอาหาร</h1><p className="mt-2 text-sm text-muted">เข้าสู่ระบบโดย {user.name}</p></div>
          <a href="/" className="rounded-xl border border-ink px-5 py-3 font-bold no-underline hover:bg-ink hover:text-white">กลับหน้าเว็บ</a>
        </header>

        <section className="mt-8 grid gap-8 min-[900px]:grid-cols-[380px_1fr] min-[900px]:items-start">
          <form onSubmit={submit} className="rounded-2xl bg-surface p-6 shadow-[0_14px_40px_rgba(49,38,24,.08)] min-[900px]:sticky min-[900px]:top-8">
            <h2 className="text-2xl font-bold">{editingId ? "แก้ไขร้าน" : "เพิ่มร้านใหม่"}</h2>
            <Field label="ชื่อร้าน"><input required value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
            <Field label="สถานที่"><input required value={form.location} onChange={(e) => update("location", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="จำนวนโต๊ะ"><input required min="1" type="number" value={form.totalTables} onChange={(e) => update("totalTables", e.target.value)} /></Field>
              <Field label="เวลาเฉลี่ย/โต๊ะ"><input required min="0.5" step="0.5" type="number" value={form.averageServiceTime} onChange={(e) => update("averageServiceTime", e.target.value)} /></Field>
            </div>
            {message && <p className="mt-4 text-sm font-semibold text-leaf" role="status">{message}</p>}
            <div className="mt-6 flex gap-2"><button disabled={saving} className="min-h-12 flex-1 rounded-xl bg-chilli px-4 font-bold text-white disabled:opacity-60">{saving ? "กำลังบันทึก…" : editingId ? "บันทึกการแก้ไข" : "เพิ่มร้านอาหาร"}</button>{editingId && <button type="button" onClick={resetForm} className="rounded-xl border border-line px-4 font-bold">ยกเลิก</button>}</div>
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold">ร้านทั้งหมด</h2><span className="rounded-full bg-leaf-soft px-3 py-1 text-sm font-bold text-leaf">{restaurants.length} ร้าน</span></div>
            {loading ? <p className="py-12 text-center text-muted">กำลังโหลดข้อมูล…</p> : (
              <div className="space-y-3">{restaurants.map((restaurant) => (
                <article key={restaurant.id} className="grid gap-4 rounded-2xl border border-line bg-surface p-5 min-[650px]:grid-cols-[1fr_auto] min-[650px]:items-center">
                  <div><p className="text-xs font-bold text-muted">ID {restaurant.id}</p><h3 className="mt-1 text-xl font-bold">{restaurant.name}</h3><p className="mt-1 text-sm text-muted">{restaurant.location} · {restaurant.totalTables} โต๊ะ · เฉลี่ย {restaurant.averageServiceTime} นาที</p></div>
                  <div className="flex gap-2"><button onClick={() => beginEdit(restaurant)} className="rounded-xl border border-ink px-4 py-2 font-bold hover:bg-ink hover:text-white">แก้ไข</button></div>
                </article>
              ))}</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return <label className="mt-5 block text-sm font-bold">{label}<span className="mt-2 block [&_input]:h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:bg-paper [&_input]:px-4 [&_input]:font-normal">{children}</span></label>;
}
