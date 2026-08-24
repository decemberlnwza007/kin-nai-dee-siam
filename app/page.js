'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const restaurants = [
  {id:'teenoi',name:'สุกี้ตี๋น้อย',type:'สุกี้ • บุฟเฟต์',category:'ชาบู',wait:35,people:18,price:276,rating:4.6,worth:87,distance:280,popular:true,img:'/assets/noodles.jpg',ratings:{'รสชาติ':4.7,'ราคา':4.8,'เวลารอ':3.7,'ปริมาณ':4.8,'ประสบการณ์':4.4}},
  {id:'kubkao',name:'กับข้าวกับปลา',type:'อาหารไทยร่วมสมัย',category:'อาหารไทย',wait:15,people:6,price:420,rating:4.7,worth:91,distance:190,popular:true,img:'/assets/thai-curry.jpg',ratings:{'รสชาติ':4.8,'ราคา':4.1,'เวลารอ':4.5,'ปริมาณ':4.3,'ประสบการณ์':4.7}},
  {id:'katsu',name:'คัตสึยะ',type:'ข้าวหน้าหมูทอดญี่ปุ่น',category:'ญี่ปุ่น',wait:8,people:3,price:220,rating:4.4,worth:89,distance:120,popular:false,img:'/assets/katsu.jpg',ratings:{'รสชาติ':4.4,'ราคา':4.6,'เวลารอ':4.8,'ปริมาณ':4.5,'ประสบการณ์':4.1}},
  {id:'somtam',name:'ตำมั่ว สยาม',type:'อาหารอีสาน',category:'อาหารไทย',wait:22,people:9,price:260,rating:4.5,worth:84,distance:350,popular:true,img:'/assets/noodles-2.jpg',ratings:{'รสชาติ':4.7,'ราคา':4.2,'เวลารอ':4.0,'ปริมาณ':4.5,'ประสบการณ์':4.3}},
  {id:'ramen',name:'ฮะจิบัง ราเมน',type:'ราเมนญี่ปุ่น',category:'ญี่ปุ่น',wait:12,people:4,price:190,rating:4.3,worth:86,distance:240,popular:false,img:'/assets/noodles.jpg',ratings:{'รสชาติ':4.3,'ราคา':4.6,'เวลารอ':4.6,'ปริมาณ':4.1,'ประสบการณ์':4.0}},
  {id:'barbq',name:'บาร์บีคิวพลาซ่า',type:'ปิ้งย่าง',category:'ปิ้งย่าง',wait:45,people:23,price:480,rating:4.6,worth:82,distance:410,popular:true,img:'/assets/katsu.jpg',ratings:{'รสชาติ':4.7,'ราคา':3.9,'เวลารอ':3.3,'ปริมาณ':4.3,'ประสบการณ์':4.6}},
];

const categories = ['ทั้งหมด','อาหารไทย','ญี่ปุ่น','ชาบู','ปิ้งย่าง'];
const money = n => `฿${n.toLocaleString('th-TH')}`;
const waitLabel = n => n <= 10 ? 'คิวน้อย' : n >= 35 ? 'คิวยาว' : `รอประมาณ ${n} นาที`;
const mapUrl = r => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${r.name} Siam Square Bangkok`)}`;

function Icon({ name }) {
  const paths = {
    back:<path d="m15 18-6-6 6-6"/>,
    home:<path d="M3 11 12 4l9 7v9H7v-6h5v6h5v-7"/>,
    compare:<path d="M5 4v16M19 4v16M8 7h7M8 12h9M8 17h5"/>,
    queue:<path d="M5 6h14M5 12h10M5 18h7"/>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>,
    map:<><path d="M12 21s6-5.1 6-12a6 6 0 1 0-12 0c0 6.9 6 12 6 12Z"/><circle cx="12" cy="9" r="2.2"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function MapLink({ restaurant, label='เปิดแผนที่' }) {
  return <a className="btn ghost map-action" href={mapUrl(restaurant)} target="_blank" rel="noopener noreferrer" aria-label={`เปิดเส้นทางไป ${restaurant.name} ใน Google Maps`}><Icon name="map"/><span>{label}</span></a>;
}

function RestaurantRow({ restaurant:r, compare, onOpen, onCompare }) {
  const selected = compare.includes(r.id);
  return <article className="restaurant-row" tabIndex="0" onClick={()=>onOpen(r.id)} onKeyDown={e=>e.key==='Enter'&&onOpen(r.id)}>
    <img src={r.img} alt={`เมนูจาก ${r.name}`}/>
    <div className="restaurant-info"><p>{r.type} • {r.distance} ม.</p><h3>{r.name}</h3><div className="row-stats"><span className={`wait-text ${r.wait<=15?'short':''}`}>{waitLabel(r.wait)}</span><span>★ {r.rating}</span><span>฿{r.price}</span></div></div>
    <button className={`compare-toggle ${selected?'selected':''}`} aria-label={`${selected?'นำออกจาก':'เพิ่มใน'}รายการเปรียบเทียบ`} onClick={e=>{e.stopPropagation();onCompare(r.id)}}>{selected?'✓':'+'}</button>
  </article>;
}

export default function Page() {
  const [route,setRoute]=useState('home');
  const [selected,setSelected]=useState(null);
  const [history,setHistory]=useState([]);
  const [category,setCategory]=useState('ทั้งหมด');
  const [search,setSearch]=useState('');
  const [compare,setCompare]=useState(['kubkao','katsu']);
  const [queue,setQueue]=useState(null);
  const [notice,setNotice]=useState(false);
  const [toast,setToast]=useState('');
  const timer=useRef(null);

  const current=restaurants.find(r=>r.id===selected)||restaurants[0];
  const showToast=message=>{setToast(message);window.clearTimeout(showToast.timer);showToast.timer=window.setTimeout(()=>setToast(''),2200)};
  const navigate=(next,id=null)=>{setHistory(h=>[...h,{route,id:selected}]);setRoute(next);if(id)setSelected(id);window.scrollTo({top:0,behavior:'smooth'})};
  const goBack=()=>setHistory(h=>{const next=[...h];const previous=next.pop();if(previous){setRoute(previous.route);setSelected(previous.id)}else setRoute('home');return next});
  const toggleCompare=id=>setCompare(items=>items.includes(id)?items.filter(x=>x!==id):items.length<3?[...items,id]:(showToast('เปรียบเทียบได้สูงสุด 3 ร้าน'),items));
  const joinQueue=id=>{setQueue({restaurantId:id,number:'A37',ahead:8,initial:8,wait:24});showToast(`รับคิว ${restaurants.find(r=>r.id===id).name} แล้ว`);window.setTimeout(()=>navigate('queue'),350)};
  const advanceQueue=(amount=1)=>setQueue(q=>{if(!q)return q;const next={...q,ahead:Math.max(0,q.ahead-amount),wait:Math.max(0,q.wait-amount*3)};if(next.ahead<=3)setNotice(true);else showToast(`เหลือ ${next.ahead} กลุ่มก่อนถึงคิวคุณ`);return next});
  const cancelQueue=()=>{window.clearInterval(timer.current);setQueue(null);setRoute('home');showToast('ยกเลิกคิวแล้ว')};

  useEffect(()=>{window.clearInterval(timer.current);if(queue&&queue.ahead>3)timer.current=window.setInterval(()=>advanceQueue(1),6500);return()=>window.clearInterval(timer.current)},[queue?.restaurantId]);

  let content;
  const common={compare,onOpen:(id)=>navigate('detail',id),onCompare:toggleCompare};
  if(route==='home') content=<Home search={search} setSearch={setSearch} category={category} setCategory={setCategory} {...common}/>;
  if(route==='detail') content=<Detail restaurant={current} onSimilar={()=>navigate('alternatives',current.id)} onJoin={()=>joinQueue(current.id)}/>;
  if(route==='compare') content=<Compare ids={compare} onOpen={id=>navigate('detail',id)}/>;
  if(route==='alternatives') content=<Alternatives restaurant={current} {...common}/>;
  if(route==='queue') content=<Queue queue={queue} onAdvance={()=>advanceQueue(2)} onCancel={cancelQueue} onHome={()=>navigate('home')}/>;

  return <div className="app-shell">
    <header className="topbar"><button className="icon-button back-button" aria-label="ย้อนกลับ" hidden={route==='home'} onClick={goBack}><Icon name="back"/></button><button className="brand" onClick={()=>setRoute('home')} aria-label="กลับหน้าหลัก"><span>กินไหนดี</span><small>SIAM</small></button>{queue&&<button className="queue-shortcut" onClick={()=>setRoute('queue')}><span className="pulse-dot"/><b>{queue.number}</b></button>}</header>
    <main tabIndex="-1">{content}</main>
    <nav className="bottom-nav" aria-label="เมนูหลัก"><Nav active={route==='home'||route==='detail'||route==='alternatives'} icon="home" label="ค้นหา" onClick={()=>setRoute('home')}/><Nav active={route==='compare'} icon="compare" label="เปรียบเทียบ" count={compare.length} onClick={()=>navigate('compare')}/><Nav active={route==='queue'} icon="queue" label="คิวของฉัน" onClick={()=>navigate('queue')}/></nav>
    <div className={`toast ${toast?'show':''}`} role="status" aria-live="polite">{toast}</div>
    {notice&&queue&&<Notification restaurant={restaurants.find(r=>r.id===queue.restaurantId)} onClose={()=>setNotice(false)}/>} 
  </div>;
}

function Nav({active,icon,label,count,onClick}){return <button className={`nav-item ${active?'active':''}`} onClick={onClick}><Icon name={icon}/><span>{label}</span>{count>0&&<i>{count}</i>}</button>}

function Home({search,setSearch,category,setCategory,compare,onOpen,onCompare}){
 const filtered=restaurants.filter(r=>(category==='ทั้งหมด'||r.category===category)&&`${r.name} ${r.type}`.toLowerCase().includes(search.toLowerCase()));const lead=filtered[0];
 return <section className="page home-page"><div className="hero-copy"><h1>มื้อนี้ คุ้มที่จะรอไหม?</h1><p>เช็กคิวจริงเทียบความคุ้ม ก่อนเดินเข้าร้าน</p></div><label className="search"><Icon name="search"/><input type="search" placeholder="ค้นหาร้านหรือเมนู" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button className="clear-search" onClick={()=>setSearch('')} aria-label="ล้างการค้นหา">×</button>}</label><div className="categories">{categories.map(c=><button key={c} className={`chip ${category===c?'active':''}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>{lead?<><div className="section-head"><h2>เลือกง่ายในตอนนี้</h2><button onClick={()=>onOpen(lead.id)}>ดูรายละเอียด</button></div><article className="lead-restaurant" tabIndex="0" onClick={()=>onOpen(lead.id)}><img src={lead.img} alt={`อาหารจาก ${lead.name}`}/><div className="lead-content"><span className="wait-callout">{waitLabel(lead.wait)}</span><h3>{lead.name}</h3><div className="lead-meta"><span>{lead.type}</span><span>★ {lead.rating}</span><span className="worth">คุ้ม {lead.worth}%</span></div></div></article><div className="section-head"><h2>{search||category!=='ทั้งหมด'?'ร้านที่ตรงกับคุณ':'ร้านใกล้ฉัน'}</h2><button>ระยะใกล้สุด</button></div><div className="restaurant-list">{filtered.slice(1).map(r=><RestaurantRow key={r.id} restaurant={r} compare={compare} onOpen={onOpen} onCompare={onCompare}/>)}</div></>:<div className="empty-state"><strong>ยังไม่เจอร้านนี้</strong>ลองค้นหาชื่อเมนู หรือเลือกหมวดอื่น</div>}</section>
}

function Detail({restaurant:r,onSimilar,onJoin}){return <section className="page detail-page"><div className="detail-hero"><img src={r.img} alt={`อาหารจาก ${r.name}`}/><div className="detail-title"><p>{r.type}</p><h1>{r.name}</h1><p>★ {r.rating} • {r.distance} เมตรจากคุณ</p></div></div><div className="big-decision"><div className="queue-time"><span>คิวตอนนี้</span><strong>{r.wait} นาที</strong><span>{r.people} กลุ่มกำลังรอ • {waitLabel(r.wait)}</span></div><div className="worth-score"><span>ความคุ้ม</span><strong>{r.worth}%</strong><span>คุ้มกับการรอ</span></div></div><div className="quick-facts"><Fact label="เฉลี่ยต่อคน" value={money(r.price)}/><Fact label="คะแนนรวม" value={`★ ${r.rating}`}/><Fact label="ระยะทาง" value={`${r.distance} ม.`}/></div><div className="ratings"><h2>ทำไมคนถึงเลือกรอ</h2>{Object.entries(r.ratings).map(([k,v])=><div className="rating-row" key={k}><span>{k}</span><div className="bar"><i style={{width:`${v/5*100}%`}}/></div><strong>{v}</strong></div>)}</div><div className="reviews"><h2>เสียงจากคนที่เพิ่งกิน</h2><article className="review"><header><span>พลอย • 18 นาทีที่แล้ว</span><span className="verdict">คุ้มที่จะรอ</span></header><p>รสชาติดีและวัตถุดิบสด รอจริงใกล้เคียงเวลาที่แจ้ง ถ้ามาช่วงเย็นแนะนำกดคิวแล้วไปเดินเล่นก่อน</p></article></div><div className="sticky-actions"><MapLink restaurant={r}/><button className="btn ghost" onClick={onSimilar}>หาร้านคล้ายกัน</button><button className="btn primary" onClick={onJoin}>เข้าคิว</button></div></section>}
function Fact({label,value}){return <div className="fact"><span>{label}</span><strong>{value}</strong></div>}

function Compare({ids,onOpen}){const items=ids.map(id=>restaurants.find(r=>r.id===id)).filter(Boolean);if(!items.length)return <section className="page compare-page"><h1>เทียบก่อนเลือก</h1><div className="empty-state"><strong>ยังไม่มีร้านให้เทียบ</strong>เพิ่มร้านจากหน้าค้นหาได้สูงสุด 3 ร้าน</div></section>;const best=[...items].sort((a,b)=>(b.worth-b.wait/2)-(a.worth-a.wait/2))[0];const rows=[['เวลารอ',r=>`${r.wait} นาที`],['ราคาต่อคน',r=>money(r.price)],['คะแนน',r=>`★ ${r.rating}`],['ความคุ้ม',r=>`${r.worth}%`],['ระยะทาง',r=>`${r.distance} ม.`]];return <section className="page compare-page"><h1>เทียบให้เห็นชัด ๆ</h1><p className="subtext">เราแนะนำจากความคุ้ม เวลารอ และระยะทาง</p><div className="compare-grid" style={{'--cols':items.length}}><div/>{items.map(r=><div key={r.id} className={`compare-head ${r.id===best.id?'recommended':''}`}><img src={r.img} alt=""/><strong>{r.name}</strong>{r.id===best.id&&<span className="recommend-label">แนะนำที่สุด</span>}</div>)}{rows.map(([label,fn])=><div key={label} style={{display:'contents'}}><div className="label">{label}</div>{items.map(r=><div key={r.id} className={r.id===best.id?'recommended':''}><strong>{fn(r)}</strong></div>)}</div>)}</div><button className="btn primary" onClick={()=>onOpen(best.id)} style={{width:'100%'}}>เลือกร้าน {best.name}</button></section>}

function Alternatives({restaurant,compare,onOpen,onCompare}){const alts=restaurants.filter(r=>r.id!==restaurant.id&&r.wait<restaurant.wait).sort((a,b)=>a.wait-b.wait).slice(0,4);return <section className="page alternatives-page"><div className="alternatives-intro"><strong>ไม่อยากรอ {restaurant.wait} นาที?</strong><p>ร้านเหล่านี้อยู่ใกล้ ราคาใกล้เคียง และได้กินเร็วกว่า</p></div><h1>เปลี่ยนร้าน แต่ไม่ลดความอร่อย</h1><p className="subtext">เทียบจากหมวดอาหาร ราคา และคะแนนของ {restaurant.name}</p><div className="restaurant-list">{alts.map(r=><RestaurantRow key={r.id} restaurant={r} compare={compare} onOpen={onOpen} onCompare={onCompare}/>)}</div></section>}

function Queue({queue,onAdvance,onCancel,onHome}){if(!queue)return <section className="page queue-page"><h1>คิวของฉัน</h1><div className="empty-state"><strong>ยังไม่มีคิวที่กำลังรอ</strong>เลือกร้านแล้วกด “เข้าคิว” เพื่อเริ่ม</div><button className="btn primary" onClick={onHome}>หาร้านตอนนี้</button></section>;const r=restaurants.find(x=>x.id===queue.restaurantId),progress=Math.max(8,100-queue.ahead/queue.initial*100);return <section className="page queue-page"><h1>คิวกำลังขยับ</h1><p className="subtext">{r.name} • {r.distance} เมตรจากคุณ</p><div className="queue-ticket"><div className="ticket-top"><span>หมายเลขคิวของคุณ</span><span>รับคิวแล้ว</span></div><div className="queue-number">{queue.number}</div><div className="queue-status"><div><strong>{queue.ahead}</strong><span>กลุ่มก่อนหน้า</span></div><div><strong>{queue.wait} นาที</strong><span>เวลารอโดยประมาณ</span></div></div></div><div className="progress-wrap"><div className="progress-label"><span>ความคืบหน้า</span><strong>{Math.round(progress)}%</strong></div><div className="progress-track"><i style={{width:`${progress}%`}}/></div></div><div className="walk-note"><Icon name="map"/><div><strong>เดินเล่นในสยามได้เลย</strong><p>เราจะแจ้งเตือนเมื่อเหลืออีก 3 คิว ไม่ต้องยืนรอหน้าร้าน</p></div></div><div className="queue-controls"><MapLink restaurant={r}/><button className="btn primary" onClick={onAdvance}>จำลองคิวถัดไป</button><button className="btn ghost" onClick={onCancel}>ข้ามคิว / ยกเลิก</button></div></section>}

function Notification({restaurant,onClose}){return <div className="notification" role="dialog" aria-modal="true"><div className="notification-card"><div className="signal">3</div><h2>เหลืออีกเพียง 3 คิว</h2><p>เตรียมกลับไปที่ร้านได้เลย ใช้เวลาเดินประมาณ 4 นาที</p><div className="notification-actions"><button className="btn ghost" onClick={onClose}>ไว้ก่อน</button><a className="btn primary map-action" href={mapUrl(restaurant)} target="_blank" rel="noopener noreferrer" onClick={onClose}><Icon name="map"/>เปิดเส้นทาง</a></div></div></div>}
