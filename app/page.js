"use client";

import { useEffect, useRef, useState } from "react";

const restaurants = [
  {
    id: "teenoi",
    name: "สุกี้ตี๋น้อย",
    type: "สุกี้ • บุฟเฟต์",
    category: "ชาบู",
    wait: 35,
    people: 18,
    price: 276,
    rating: 4.6,
    worth: 87,
    distance: 280,
    popular: true,
    img: "/assets/noodles.jpg",
    ratings: {
      รสชาติ: 4.7,
      ราคา: 4.8,
      เวลารอ: 3.7,
      ปริมาณ: 4.8,
      ประสบการณ์: 4.4,
    },
  },
  {
    id: "kubkao",
    name: "กับข้าวกับปลา",
    type: "อาหารไทยร่วมสมัย",
    category: "อาหารไทย",
    wait: 15,
    people: 6,
    price: 420,
    rating: 4.7,
    worth: 91,
    distance: 190,
    popular: true,
    img: "/assets/thai-curry.jpg",
    ratings: {
      รสชาติ: 4.8,
      ราคา: 4.1,
      เวลารอ: 4.5,
      ปริมาณ: 4.3,
      ประสบการณ์: 4.7,
    },
  },
  {
    id: "katsu",
    name: "คัตสึยะ",
    type: "ข้าวหน้าหมูทอดญี่ปุ่น",
    category: "ญี่ปุ่น",
    wait: 8,
    people: 3,
    price: 220,
    rating: 4.4,
    worth: 89,
    distance: 120,
    popular: false,
    img: "/assets/katsu.jpg",
    ratings: {
      รสชาติ: 4.4,
      ราคา: 4.6,
      เวลารอ: 4.8,
      ปริมาณ: 4.5,
      ประสบการณ์: 4.1,
    },
  },
  {
    id: "somtam",
    name: "ตำมั่ว สยาม",
    type: "อาหารอีสาน",
    category: "อาหารไทย",
    wait: 22,
    people: 9,
    price: 260,
    rating: 4.5,
    worth: 84,
    distance: 350,
    popular: true,
    img: "/assets/noodles-2.jpg",
    ratings: {
      รสชาติ: 4.7,
      ราคา: 4.2,
      เวลารอ: 4.0,
      ปริมาณ: 4.5,
      ประสบการณ์: 4.3,
    },
  },
  {
    id: "ramen",
    name: "ฮะจิบัง ราเมน",
    type: "ราเมนญี่ปุ่น",
    category: "ญี่ปุ่น",
    wait: 12,
    people: 4,
    price: 190,
    rating: 4.3,
    worth: 86,
    distance: 240,
    popular: false,
    img: "/assets/noodles.jpg",
    ratings: {
      รสชาติ: 4.3,
      ราคา: 4.6,
      เวลารอ: 4.6,
      ปริมาณ: 4.1,
      ประสบการณ์: 4.0,
    },
  },
  {
    id: "barbq",
    name: "บาร์บีคิวพลาซ่า",
    type: "ปิ้งย่าง",
    category: "ปิ้งย่าง",
    wait: 45,
    people: 23,
    price: 480,
    rating: 4.6,
    worth: 82,
    distance: 410,
    popular: true,
    img: "/assets/katsu.jpg",
    ratings: {
      รสชาติ: 4.7,
      ราคา: 3.9,
      เวลารอ: 3.3,
      ปริมาณ: 4.3,
      ประสบการณ์: 4.6,
    },
  },
];

const categories = ["ทั้งหมด", "อาหารไทย", "ญี่ปุ่น", "ชาบู", "ปิ้งย่าง"];
const money = (n) => `฿${n.toLocaleString("th-TH")}`;
const waitLabel = (n) =>
  n <= 10 ? "คิวน้อย" : n >= 35 ? "คิวยาว" : `รอประมาณ ${n} นาที`;
const mapUrl = (r) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${r.name} Siam Square Bangkok`)}`;

function Icon({ name }) {
  const paths = {
    back: <path d="m15 18-6-6 6-6" />,
    home: <path d="M3 11 12 4l9 7v9H7v-6h5v6h5v-7" />,
    compare: <path d="M5 4v16M19 4v16M8 7h7M8 12h9M8 17h5" />,
    queue: <path d="M5 6h14M5 12h10M5 18h7" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    map: (
      <>
        <path d="M12 21s6-5.1 6-12a6 6 0 1 0-12 0c0 6.9 6 12 6 12Z" />
        <circle cx="12" cy="9" r="2.2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function MapLink({ restaurant, label = "เปิดแผนที่" }) {
  return (
    <a
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-transparent px-4 py-2.5 font-bold text-ink no-underline transition-colors hover:bg-surface [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
      href={mapUrl(restaurant)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`เปิดเส้นทางไป ${restaurant.name} ใน Google Maps`}
    >
      <Icon name="map" />
      <span>{label}</span>
    </a>
  );
}

function RestaurantRow({ restaurant: r, compare, onOpen, onCompare }) {
  const selected = compare.includes(r.id);
  return (
    <article
      className="group relative grid cursor-pointer grid-cols-[88px_minmax(0,1fr)_32px] gap-3 border-b border-line py-4 transition-colors hover:bg-surface min-[900px]:grid-cols-[118px_minmax(0,1fr)_32px] min-[900px]:gap-4 min-[900px]:py-5"
      tabIndex="0"
      onClick={() => onOpen(r.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(r.id)}
    >
      <img className="h-[88px] w-[88px] rounded-xl object-cover min-[900px]:h-[106px] min-[900px]:w-[118px]" src={r.img} alt={`เมนูจาก ${r.name}`} />
      <div className="min-w-0">
        <p className="text-[13px] text-muted">
          {r.type} • {r.distance} ม.
        </p>
        <h3 className="my-1 text-[17px] font-bold min-[900px]:text-lg">{r.name}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-[13px] font-semibold">
          <span className={r.wait <= 15 ? "text-leaf" : "text-chilli-dark"}>
            {waitLabel(r.wait)}
          </span>
          <span>★ {r.rating}</span>
          <span>฿{r.price}</span>
        </div>
      </div>
      <button
        className={`h-8 w-8 self-start rounded-full border font-bold transition-transform hover:scale-105 ${selected ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}
        aria-label={`${selected ? "นำออกจาก" : "เพิ่มใน"}รายการเปรียบเทียบ`}
        onClick={(e) => {
          e.stopPropagation();
          onCompare(r.id);
        }}
      >
        {selected ? "✓" : "+"}
      </button>
    </article>
  );
}

export default function Page() {
  const [route, setRoute] = useState("home");
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [category, setCategory] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [compare, setCompare] = useState(["kubkao", "katsu"]);
  const [queue, setQueue] = useState(null);
  const [notice, setNotice] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const current = restaurants.find((r) => r.id === selected) || restaurants[0];
  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2200);
  };
  const navigate = (next, id = null) => {
    setHistory((h) => [...h, { route, id: selected }]);
    setRoute(next);
    if (id) setSelected(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () =>
    setHistory((h) => {
      const next = [...h];
      const previous = next.pop();
      if (previous) {
        setRoute(previous.route);
        setSelected(previous.id);
      } else setRoute("home");
      return next;
    });
  const toggleCompare = (id) =>
    setCompare((items) =>
      items.includes(id)
        ? items.filter((x) => x !== id)
        : items.length < 3
          ? [...items, id]
          : (showToast("เปรียบเทียบได้สูงสุด 3 ร้าน"), items),
    );
  const joinQueue = (id) => {
    setQueue({
      restaurantId: id,
      number: "A37",
      ahead: 8,
      initial: 8,
      wait: 24,
    });
    showToast(`รับคิว ${restaurants.find((r) => r.id === id).name} แล้ว`);
    window.setTimeout(() => navigate("queue"), 350);
  };
  const advanceQueue = (amount = 1) =>
    setQueue((q) => {
      if (!q) return q;
      const next = {
        ...q,
        ahead: Math.max(0, q.ahead - amount),
        wait: Math.max(0, q.wait - amount * 3),
      };
      if (next.ahead <= 3) setNotice(true);
      else showToast(`เหลือ ${next.ahead} กลุ่มก่อนถึงคิวคุณ`);
      return next;
    });
  const cancelQueue = () => {
    window.clearInterval(timer.current);
    setQueue(null);
    setRoute("home");
    showToast("ยกเลิกคิวแล้ว");
  };

  useEffect(() => {
    window.clearInterval(timer.current);
    if (queue && queue.ahead > 3)
      timer.current = window.setInterval(() => advanceQueue(1), 6500);
    return () => window.clearInterval(timer.current);
  }, [queue?.restaurantId]);

  let content;
  const common = {
    compare,
    onOpen: (id) => navigate("detail", id),
    onCompare: toggleCompare,
  };
  if (route === "home")
    content = (
      <Home
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        {...common}
      />
    );
  if (route === "detail")
    content = (
      <Detail
        restaurant={current}
        onSimilar={() => navigate("alternatives", current.id)}
        onJoin={() => joinQueue(current.id)}
      />
    );
  if (route === "compare")
    content = <Compare ids={compare} onOpen={(id) => navigate("detail", id)} />;
  if (route === "alternatives")
    content = <Alternatives restaurant={current} {...common} />;
  if (route === "queue")
    content = (
      <Queue
        queue={queue}
        onAdvance={() => advanceQueue(2)}
        onCancel={cancelQueue}
        onHome={() => navigate("home")}
      />
    );

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[480px] bg-paper pb-[86px] min-[760px]:my-6 min-[760px]:min-h-[calc(100dvh-48px)] min-[760px]:overflow-clip min-[760px]:rounded-2xl min-[760px]:shadow-[0_18px_60px_rgba(40,31,20,.14)] min-[900px]:my-0 min-[900px]:max-w-none min-[900px]:overflow-visible min-[900px]:rounded-none min-[900px]:pb-20 min-[900px]:shadow-none">
      <header className="sticky top-0 z-20 flex h-[66px] items-center border-b border-transparent bg-paper/95 px-5 min-[900px]:h-[78px] min-[900px]:border-line min-[900px]:bg-surface min-[900px]:px-[max(32px,calc((100vw-1200px)/2))]">
        <button
          className="-ml-2.5 mr-1 grid h-10 w-10 place-items-center border-0 bg-transparent [&_svg]:h-6 [&_svg]:w-6 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8] min-[900px]:absolute min-[900px]:left-[max(18px,calc((100vw-1300px)/2))]"
          aria-label="ย้อนกลับ"
          hidden={route === "home"}
          onClick={goBack}
        >
          <Icon name="back" />
        </button>
        <button
          className="flex items-baseline gap-2 border-0 bg-transparent py-1 text-xl font-bold min-[900px]:text-[23px]"
          onClick={() => setRoute("home")}
          aria-label="กลับหน้าหลัก"
        >
          <span>กินไหนดี</span>
          <small className="font-display text-[9px] font-extrabold tracking-[.16em] text-chilli">SIAM</small>
        </button>
        {queue && (
          <button className="ml-auto flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 min-[900px]:hidden" onClick={() => setRoute("queue")}>
            <span className="h-2 w-2 rounded-full bg-chilli" />
            <b>{queue.number}</b>
          </button>
        )}
      </header>
      <main className="min-h-[calc(100dvh-152px)] focus:outline-none min-[900px]:mx-auto min-[900px]:min-h-[calc(100vh-78px)] min-[900px]:w-[min(calc(100%-64px),1200px)]" tabIndex="-1">{content}</main>
      <nav className="fixed bottom-0 left-1/2 z-30 grid h-[72px] w-full max-w-[480px] -translate-x-1/2 grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] min-[760px]:bottom-6 min-[760px]:rounded-b-2xl min-[900px]:top-0 min-[900px]:right-[max(32px,calc((100vw-1200px)/2))] min-[900px]:bottom-auto min-[900px]:left-auto min-[900px]:h-[78px] min-[900px]:w-[460px] min-[900px]:translate-x-0 min-[900px]:border-0 min-[900px]:bg-transparent min-[900px]:pb-0" aria-label="เมนูหลัก">
        <Nav
          active={
            route === "home" || route === "detail" || route === "alternatives"
          }
          icon="home"
          label="ค้นหา"
          onClick={() => setRoute("home")}
        />
        <Nav
          active={route === "compare"}
          icon="compare"
          label="เปรียบเทียบ"
          count={compare.length}
          onClick={() => navigate("compare")}
        />
        <Nav
          active={route === "queue"}
          icon="queue"
          label="คิวของฉัน"
          onClick={() => navigate("queue")}
        />
      </nav>
      <div
        className={`pointer-events-none fixed bottom-[88px] left-1/2 z-40 w-[min(calc(100%-32px),448px)] -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-white transition-all ${toast ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
      {notice && queue && (
        <Notification
          restaurant={restaurants.find((r) => r.id === queue.restaurantId)}
          onClose={() => setNotice(false)}
        />
      )}
    </div>
  );
}

function Nav({ active, icon, label, count, onClick }) {
  return (
    <button className={`relative flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent text-[11px] min-[900px]:min-w-[130px] min-[900px]:flex-row min-[900px]:gap-2 min-[900px]:text-sm [&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8] ${active ? "font-semibold text-chilli" : "text-muted hover:text-ink"}`} onClick={onClick}>
      <Icon name={icon} />
      <span>{label}</span>
      {count > 0 && <i className="absolute right-1/4 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-chilli px-1 text-[10px] not-italic text-white min-[900px]:right-5 min-[900px]:top-5">{count}</i>}
    </button>
  );
}

function Home({
  search,
  setSearch,
  category,
  setCategory,
  compare,
  onOpen,
  onCompare,
}) {
  const filtered = restaurants.filter(
    (r) =>
      (category === "ทั้งหมด" || r.category === category) &&
      `${r.name} ${r.type}`.toLowerCase().includes(search.toLowerCase()),
  );
  const lead = filtered[0];
  return (
    <section className="px-5 pb-16 pt-5 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
      <div className="min-[900px]:grid min-[900px]:grid-cols-[minmax(420px,1.25fr)_minmax(320px,.75fr)] min-[900px]:items-end min-[900px]:gap-16">
        <h1 className="mb-2 max-w-[13ch] text-[32px] font-bold leading-[1.15] tracking-[-.025em] min-[900px]:max-w-[720px] min-[900px]:text-[clamp(48px,5vw,72px)] min-[900px]:leading-[1.02] min-[900px]:tracking-[-.035em]">มื้อนี้ คุ้มที่จะรอไหม?</h1>
        <p className="text-[15px] text-muted min-[900px]:max-w-[390px] min-[900px]:pb-2 min-[900px]:text-lg min-[900px]:leading-relaxed">เช็กคิวจริงเทียบความคุ้ม ก่อนเดินเข้าร้าน</p>
      </div>
      <label className="relative my-6 block min-[900px]:mb-4 min-[900px]:mt-10 min-[900px]:w-full min-[900px]:max-w-[680px]">
        <span className="absolute left-4 top-[15px] text-muted min-[900px]:top-[18px] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2"><Icon name="search" /></span>
        <input
          className="h-[50px] w-full rounded-xl border border-line bg-surface px-[46px] text-ink placeholder:text-[#777269] min-[900px]:h-14 min-[900px]:text-[17px]"
          type="search"
          placeholder="ค้นหาร้านหรือเมนู"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* {search && (
          <button
            className="clear-search"
            onClick={() => setSearch("")}
            aria-label="ล้างการค้นหา"
          >
            ×
          </button>
        )} */}
      </label>
      
      <div className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:overflow-visible min-[900px]:px-0 [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c}
            className={`whitespace-nowrap rounded-full border px-4 py-2 transition-colors min-[900px]:min-h-[42px] min-[900px]:px-[18px] ${category === c ? "border-ink bg-ink text-white" : "border-line bg-transparent hover:border-ink"}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {lead ? (
        <>
          <div className="mb-4 mt-10 flex items-end justify-between min-[900px]:mt-14 min-[900px]:mb-5">
            <h2 className="text-[21px] font-bold leading-tight min-[900px]:text-[28px]">เลือกง่ายในตอนนี้</h2>
            <button className="border-0 bg-transparent p-1 font-semibold text-chilli" onClick={() => onOpen(lead.id)}>ดูรายละเอียด</button>
          </div>
          <article
            className="relative flex min-h-[270px] cursor-pointer items-end overflow-hidden rounded-2xl bg-ink text-white min-[900px]:min-h-[440px]"
            tabIndex="0"
            onClick={() => onOpen(lead.id)}
          >
            <img className="absolute inset-0 h-full w-full object-cover opacity-70" src={lead.img} alt={`อาหารจาก ${lead.name}`} />
            <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent p-5 pt-24 min-[900px]:p-[34px] min-[900px]:pt-32">
              <span className="mb-2.5 inline-flex rounded-lg bg-white px-2.5 py-2 font-bold text-ink min-[900px]:text-lg">{waitLabel(lead.wait)}</span>
              <h3 className="text-[27px] font-bold leading-[1.15] min-[900px]:text-[42px]">{lead.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[#f3efe7] min-[900px]:gap-5 min-[900px]:text-[17px]">
                <span>{lead.type}</span>
                <span>★ {lead.rating}</span>
                <span className="font-bold text-[#bfe8d3]">คุ้ม {lead.worth}%</span>
              </div>
            </div>
          </article>
          <div className="mb-4 mt-10 flex items-end justify-between min-[900px]:mb-5 min-[900px]:mt-16">
            <h2 className="text-[21px] font-bold leading-tight min-[900px]:text-[28px]">
              {search || category !== "ทั้งหมด"
                ? "ร้านที่ตรงกับคุณ"
                : "ร้านใกล้ฉัน"}
            </h2>
            <button className="border-0 bg-transparent p-1 font-semibold text-chilli">ระยะใกล้สุด</button>
          </div>
          <div className="border-t border-line min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-x-8">
            {filtered.slice(1).map((r) => (
              <RestaurantRow
                key={r.id}
                restaurant={r}
                compare={compare}
                onOpen={onOpen}
                onCompare={onCompare}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="px-5 py-14 text-center text-muted">
          <strong className="mb-1 block text-xl text-ink">ยังไม่เจอร้านนี้</strong>ลองค้นหาชื่อเมนู หรือเลือกหมวดอื่น
        </div>
      )}
    </section>
  );
}

function Detail({ restaurant: r, onSimilar, onJoin }) {
  return (
    <section className="px-5 pb-16 pt-5 min-[900px]:grid min-[900px]:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] min-[900px]:items-start min-[900px]:gap-x-14 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
      <div className="relative -mx-5 -mt-5 h-[300px] bg-[#ddd] min-[900px]:sticky min-[900px]:top-[106px] min-[900px]:col-start-1 min-[900px]:row-span-5 min-[900px]:mx-0 min-[900px]:mt-0 min-[900px]:h-[min(68vh,660px)] min-[900px]:min-h-[540px] min-[900px]:overflow-hidden min-[900px]:rounded-2xl">
        <img className="h-full w-full object-cover" src={r.img} alt={`อาหารจาก ${r.name}`} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-[18px] pt-24 text-white min-[900px]:px-8 min-[900px]:pb-7">
          <p className="opacity-90">{r.type}</p>
          <h1 className="my-1 text-[31px] font-bold leading-[1.1] min-[900px]:text-[44px]">{r.name}</h1>
          <p>
            ★ {r.rating} • {r.distance} เมตรจากคุณ
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[1.2fr_.8fr] gap-4 border-b border-line py-6 min-[900px]:col-start-2 min-[900px]:pt-0">
        <div>
          <span className="text-sm text-muted">คิวตอนนี้</span>
          <strong className="font-display block text-[42px] font-extrabold leading-none tracking-[-.04em] text-chilli min-[900px]:text-[52px]">{r.wait} นาที</strong>
          <span className="text-sm text-muted">
            {r.people} กลุ่มกำลังรอ • {waitLabel(r.wait)}
          </span>
        </div>
        <div className="border-l border-line pl-4">
          <span className="text-sm text-muted">ความคุ้ม</span>
          <strong className="font-display block text-[28px] font-extrabold leading-tight text-leaf">{r.worth}%</strong>
          <span className="text-sm text-muted">คุ้มกับการรอ</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 border-b border-line py-5 min-[900px]:col-start-2">
        <Fact label="เฉลี่ยต่อคน" value={money(r.price)} />
        <Fact label="คะแนนรวม" value={`★ ${r.rating}`} />
        <Fact label="ระยะทาง" value={`${r.distance} ม.`} />
      </div>
      <div className="border-b border-line py-8 min-[900px]:col-start-2">
        <h2 className="mb-5 text-xl font-bold">ทำไมคนถึงเลือกรอ</h2>
        {Object.entries(r.ratings).map(([k, v]) => (
          <div className="my-3 grid grid-cols-[82px_1fr_30px] items-center gap-2.5 text-sm" key={k}>
            <span>{k}</span>
            <div className="h-[7px] overflow-hidden rounded-full bg-[#e3ded4]">
              <i className="block h-full rounded-full bg-leaf" style={{ width: `${(v / 5) * 100}%` }} />
            </div>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <div className="py-8 min-[900px]:col-start-2">
        <h2 className="mb-5 text-xl font-bold">เสียงจากคนที่เพิ่งกิน</h2>
        <article className="border-b border-line py-5">
          <header className="flex justify-between gap-4 font-semibold">
            <span>พลอย • 18 นาทีที่แล้ว</span>
            <span className="text-leaf">คุ้มที่จะรอ</span>
          </header>
          <p className="mt-2 text-sm text-[#4f4c46]">
            รสชาติดีและวัตถุดิบสด รอจริงใกล้เคียงเวลาที่แจ้ง
            ถ้ามาช่วงเย็นแนะนำกดคิวแล้วไปเดินเล่นก่อน
          </p>
        </article>
      </div>
      <div className="sticky bottom-[70px] z-10 grid grid-cols-2 gap-2 bg-paper py-3 min-[900px]:bottom-5 min-[900px]:col-start-2 min-[900px]:grid-cols-3 min-[900px]:rounded-[14px] min-[900px]:bg-surface min-[900px]:p-3 min-[900px]:shadow-[0_14px_34px_rgba(49,38,24,.12)]">
        <MapLink restaurant={r} />
        <button className="min-h-12 rounded-xl border border-line bg-transparent px-4 py-2.5 font-bold hover:bg-surface" onClick={onSimilar}>
          หาร้านคล้ายกัน
        </button>
        <button className="min-h-12 rounded-xl bg-chilli px-4 py-2.5 font-bold text-white transition-colors hover:bg-chilli-dark" onClick={onJoin}>
          เข้าคิว
        </button>
      </div>
    </section>
  );
}
function Fact({ label, value }) {
  return (
    <div>
      <span className="block text-xs text-muted">{label}</span>
      <strong className="text-[15px]">{value}</strong>
    </div>
  );
}

function Compare({ ids, onOpen }) {
  const items = ids
    .map((id) => restaurants.find((r) => r.id === id))
    .filter(Boolean);
  if (!items.length)
    return (
      <section className="px-5 pb-16 pt-5 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
        <h1 className="mb-2 text-[30px] font-bold leading-tight min-[900px]:text-[46px]">เทียบก่อนเลือก</h1>
        <div className="px-5 py-14 text-center text-muted">
          <strong className="mb-1 block text-xl text-ink">ยังไม่มีร้านให้เทียบ</strong>เพิ่มร้านจากหน้าค้นหาได้สูงสุด 3
          ร้าน
        </div>
      </section>
    );
  const best = [...items].sort(
    (a, b) => b.worth - b.wait / 2 - (a.worth - a.wait / 2),
  )[0];
  const rows = [
    ["เวลารอ", (r) => `${r.wait} นาที`],
    ["ราคาต่อคน", (r) => money(r.price)],
    ["คะแนน", (r) => `★ ${r.rating}`],
    ["ความคุ้ม", (r) => `${r.worth}%`],
    ["ระยะทาง", (r) => `${r.distance} ม.`],
  ];
  return (
    <section className="px-5 pb-16 pt-5 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
      <h1 className="mb-2 text-[30px] font-bold leading-tight min-[900px]:text-[46px]">เทียบให้เห็นชัด ๆ</h1>
      <p className="mb-6 max-w-[680px] text-muted min-[900px]:text-[17px]">เราแนะนำจากความคุ้ม เวลารอ และระยะทาง</p>
      <div className="-mx-5 grid grid-cols-[88px_repeat(var(--cols),minmax(105px,1fr))] overflow-x-auto px-5 pb-4 min-[900px]:mx-0 min-[900px]:grid-cols-[150px_repeat(var(--cols),minmax(220px,1fr))] min-[900px]:overflow-visible min-[900px]:px-0" style={{ "--cols": items.length }}>
        <div />
        {items.map((r) => (
          <div
            key={r.id}
            className={`min-h-[150px] border-b border-line p-3 min-[900px]:min-h-[210px] min-[900px]:p-5 ${r.id === best.id ? "bg-leaf-soft rounded" : ""}`}
          >
            <img className="h-[62px] w-[72px] rounded-[10px] object-cover min-[900px]:h-[120px] min-[900px]:w-full" src={r.img} alt="" />
            <strong className="mt-2 block text-sm min-[900px]:text-[17px]">{r.name}</strong>
            {r.id === best.id && (
              <span className="mt-1.5 inline-block text-[11px] font-bold text-leaf">แนะนำที่สุด</span>
            )}
          </div>
        ))}
        {rows.map(([label, fn]) => (
          <div key={label} style={{ display: "contents" }}>
            <div className="border-b border-line py-3 pr-3 text-[13px] text-muted min-[900px]:p-5 min-[900px]:pl-0">{label}</div>
            {items.map((r) => (
              <div className={`border-b border-line p-3 min-[900px]:p-5 ${r.id === best.id ? "bg-leaf-soft" : ""}`} key={r.id}>
                <strong>{fn(r)}</strong>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="mt-4 min-h-12 w-full rounded-xl bg-chilli px-4 py-2.5 font-bold text-white transition-colors hover:bg-chilli-dark"
        onClick={() => onOpen(best.id)}
      >
        เลือกร้าน {best.name}
      </button>
    </section>
  );
}

function Alternatives({ restaurant, compare, onOpen, onCompare }) {
  const alts = restaurants
    .filter((r) => r.id !== restaurant.id && r.wait < restaurant.wait)
    .sort((a, b) => a.wait - b.wait)
    .slice(0, 4);
  return (
    <section className="px-5 pb-16 pt-5 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
      <div className="-mx-5 mb-6 bg-amber-soft px-5 py-6 min-[900px]:mx-0 min-[900px]:mb-8 min-[900px]:rounded-2xl min-[900px]:px-10 min-[900px]:py-8">
        <strong className="block text-2xl leading-tight min-[900px]:text-[34px]">ไม่อยากรอ {restaurant.wait} นาที?</strong>
        <p className="mt-1 text-[#5f4c2f]">ร้านเหล่านี้อยู่ใกล้ ราคาใกล้เคียง และได้กินเร็วกว่า</p>
      </div>
      <h1 className="mb-2 text-[30px] font-bold leading-tight min-[900px]:text-[46px]">เปลี่ยนร้าน แต่ไม่ลดความอร่อย</h1>
      <p className="mb-6 max-w-[680px] text-muted min-[900px]:text-[17px]">
        เทียบจากหมวดอาหาร ราคา และคะแนนของ {restaurant.name}
      </p>
      <div className="border-t border-line min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-x-8">
        {alts.map((r) => (
          <RestaurantRow
            key={r.id}
            restaurant={r}
            compare={compare}
            onOpen={onOpen}
            onCompare={onCompare}
          />
        ))}
      </div>
    </section>
  );
}

function Queue({ queue, onAdvance, onCancel, onHome }) {
  if (!queue)
    return (
      <section className="px-5 pb-16 pt-5 min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
        <h1 className="mb-2 text-[30px] font-bold leading-tight min-[900px]:text-[46px]">คิวของฉัน</h1>
        <div className="px-5 py-14 text-center text-muted">
          <strong className="mb-1 block text-xl text-ink">ยังไม่มีคิวที่กำลังรอ</strong>เลือกร้านแล้วกด “เข้าคิว”
          เพื่อเริ่ม
        </div>
        <button className="min-h-12 rounded-xl bg-chilli px-4 py-2.5 font-bold text-white hover:bg-chilli-dark" onClick={onHome}>
          หาร้านตอนนี้
        </button>
      </section>
    );
  const r = restaurants.find((x) => x.id === queue.restaurantId),
    progress = Math.max(8, 100 - (queue.ahead / queue.initial) * 100);
  return (
    <section className="px-5 pb-16 pt-5 min-[900px]:grid min-[900px]:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)] min-[900px]:items-start min-[900px]:gap-x-[70px] min-[900px]:px-0 min-[900px]:pb-24 min-[900px]:pt-12">
      <h1 className="mb-2 text-[30px] font-bold leading-tight min-[900px]:col-start-1 min-[900px]:text-[46px]">คิวกำลังขยับ</h1>
      <p className="mb-6 text-muted min-[900px]:col-start-1 min-[900px]:text-[17px]">
        {r.name} • {r.distance} เมตรจากคุณ
      </p>
      <div className="relative my-6 overflow-hidden rounded-2xl bg-ink p-[22px] text-white before:absolute before:top-1/2 before:-left-[11px] before:h-[22px] before:w-[22px] before:-translate-y-1/2 before:rounded-full before:bg-paper after:absolute after:top-1/2 after:-right-[11px] after:h-[22px] after:w-[22px] after:-translate-y-1/2 after:rounded-full after:bg-paper min-[900px]:col-start-1 min-[900px]:mt-7 min-[900px]:p-[30px]">
        <div className="flex justify-between text-[#d5d1c8]">
          <span>หมายเลขคิวของคุณ</span>
          <span>รับคิวแล้ว</span>
        </div>
        <div className="font-display my-4 text-[58px] font-extrabold leading-none tracking-[-.04em] min-[900px]:text-[78px]">{queue.number}</div>
        <div className="flex justify-between border-t border-dashed border-[#6a6863] pt-4">
          <div>
            <strong className="block text-[22px]">{queue.ahead}</strong>
            <span className="text-xs text-[#cbc7be]">กลุ่มก่อนหน้า</span>
          </div>
          <div>
            <strong className="block text-[22px]">{queue.wait} นาที</strong>
            <span className="text-xs text-[#cbc7be]">เวลารอโดยประมาณ</span>
          </div>
        </div>
      </div>
      <div className="my-8 min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:mt-[18px]">
        <div className="mb-2.5 flex justify-between text-sm">
          <span>ความคืบหน้า</span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-line">
          <i className="block h-full bg-chilli" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex gap-4 border-y border-line py-6 min-[900px]:col-start-2 min-[900px]:mt-16 [&>svg]:h-7 [&>svg]:w-7 [&>svg]:shrink-0 [&>svg]:fill-none [&>svg]:stroke-leaf [&>svg]:stroke-[1.7]">
        <Icon name="map" />
        <div>
          <strong className="block text-base text-ink">เดินเล่นในสยามได้เลย</strong>
          <p className="text-sm text-muted">เราจะแจ้งเตือนเมื่อเหลืออีก 3 คิว ไม่ต้องยืนรอหน้าร้าน</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 min-[900px]:col-start-2">
        <MapLink restaurant={r} />
        <button className="min-h-12 rounded-xl bg-chilli px-4 py-2.5 font-bold text-white hover:bg-chilli-dark" onClick={onAdvance}>
          จำลองคิวถัดไป
        </button>
        <button className="min-h-12 rounded-xl border border-line bg-transparent px-4 py-2.5 font-bold hover:bg-surface" onClick={onCancel}>
          ข้ามคิว / ยกเลิก
        </button>
      </div>
    </section>
  );
}

function Notification({ restaurant, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-[18px] min-[760px]:items-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-[448px] rounded-2xl bg-surface p-6 shadow-[0_10px_30px_rgba(49,38,24,.09)] min-[760px]:p-7">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-chilli font-extrabold text-white">3</div>
        <h2 className="text-[25px] font-bold leading-tight">เหลืออีกเพียง 3 คิว</h2>
        <p className="mb-5 mt-2 text-muted">เตรียมกลับไปที่ร้านได้เลย ใช้เวลาเดินประมาณ 4 นาที</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="min-h-12 rounded-xl border border-line bg-transparent px-4 py-2.5 font-bold hover:bg-paper" onClick={onClose}>
            ไว้ก่อน
          </button>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-chilli px-4 py-2.5 font-bold text-white no-underline hover:bg-chilli-dark [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
            href={mapUrl(restaurant)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Icon name="map" />
            เปิดเส้นทาง
          </a>
        </div>
      </div>
    </div>
  );
}
