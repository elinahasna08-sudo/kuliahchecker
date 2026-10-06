let BASE={
 "Barang di tas":[["💻","Laptop & charger"],["📚","Buku, modul, atau catatan"],["✏️","Alat tulis"],["🪪","KTM (kartu mahasiswa)"],["💧","Botol minum"],["☔","Payung atau jas hujan"]],
 "Tugas & jadwal":[["🗓️","Cek jadwal & ruang kelas hari ini"],["📝","Tugas selesai dan siap dikumpul"],["💬","Cek grup kelas & info dosen"],["🔋","HP dan power bank terisi"]],
 "Persiapan diri":[["🍳","Sarapan"],["🚿","Mandi dan berpakaian rapi"],["💊","Obat atau vitamin bila perlu"]],
 "Perjalanan":[["💳","Uang atau e-wallet cukup"],["🛵","Kendaraan siap: BBM, helm, SIM"],["🔒","Pintu dikunci, listrik dimatikan"]]
};
let MODES={
 "Kuliah biasa":{},
 "Praktikum":{"Barang di tas":[["🥼","Jas lab & alat praktikum"],["📘","Modul dan laporan praktikum"]]},
 "Ujian":{"Barang di tas":[["🎫","Kartu ujian"],["🖊️","Pulpen cadangan & pensil 2B"],["🧮","Kalkulator (jika diizinkan)"]],"Tugas & jadwal":[["📖","Baca ulang ringkasan materi"]]}
};
const KEY="kuliahcheck:v2",$=id=>document.getElementById(id);
const today=new Date().toISOString().slice(0,10);
let S={day:today,mode:"Kuliah biasa",depart:"07:00",done:{},custom:[]};
try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.custom){S={...S,...x};if(x.day!==today){S.day=today;S.done={}}}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};

function groups(){
  const g={};
  Object.keys(BASE).forEach(k=>g[k]=[...BASE[k],...(MODES[S.mode][k]||[])]);
  return g;
}
function allItems(){
  const out=[];
  Object.entries(groups()).forEach(([k,v])=>v.forEach(([e,t])=>out.push(k+"|"+t)));
  S.custom.forEach(c=>out.push("c|"+c.id));
  return out;
}
function row(id,emoji,text,custom){
  const l=document.createElement("label");l.className="item";
  l.innerHTML=`<input type="checkbox" ${S.done[id]?"checked":""}><span class="ic">${emoji}</span><span class="tx"></span>${custom?'<button class="del" aria-label="Hapus">✕</button>':""}<span class="box">✓</span>`;
  l.querySelector(".tx").textContent=text;
  l.querySelector("input").onchange=e=>{S.done[id]=e.target.checked;save();update()};
  if(custom)l.querySelector(".del").onclick=e=>{e.preventDefault();S.custom=S.custom.filter(c=>c.id!==custom);delete S.done[id];save();render()};
  return l;
}
function render(){
  $("modes").innerHTML="";
  Object.keys(MODES).forEach(m=>{
    const b=document.createElement("button");b.className="chip";b.textContent=m;b.setAttribute("aria-pressed",m===S.mode);
    b.onclick=()=>{S.mode=m;save();render()};$("modes").appendChild(b);
  });
  $("lists").innerHTML="";
  Object.entries(groups()).forEach(([k,v])=>{
    const s=document.createElement("section");
    s.innerHTML=`<h3>${k}<small data-g="${k}"></small></h3>`;
    v.forEach(([e,t])=>s.appendChild(row(k+"|"+t,e,t)));
    $("lists").appendChild(s);
  });
  $("customList").innerHTML="";
  S.custom.forEach(c=>$("customList").appendChild(row("c|"+c.id,"📌",c.t,c.id)));
  update();
}
function update(){
  const ids=allItems(),n=ids.length,d=ids.filter(i=>S.done[i]).length,p=n?Math.round(d/n*100):0,all=d===n&&n>0;
  $("ring").style.setProperty("--p",p);
  $("fill").style.width=p+"%";
  $("count").textContent=`${d} dari ${n} sudah siap`;
  $("status").classList.toggle("done",all);
  $("emoji").textContent=all?"✅":"🎒";
  $("stTitle").textContent=all?"Siap berangkat!":d===0?"Belum ada yang dicek":d/n>=.6?"Sedikit lagi":"Lanjut siapkan";
  $("stSub").textContent=all?"Semua sudah beres. Hati-hati di jalan.":`Masih ${n-d} hal yang perlu dicek sebelum jalan.`;
  $("go").disabled=!all;
  document.querySelectorAll("[data-g]").forEach(el=>{
    const g=groups()[el.dataset.g]||[],x=g.filter(([e,t])=>S.done[el.dataset.g+"|"+t]).length;
    el.textContent=`${x}/${g.length}`;
  });
  countdown();
}
function countdown(){
  const [h,m]=S.depart.split(":").map(Number),t=new Date();t.setHours(h,m,0,0);
  const diff=Math.round((t-new Date())/60000);
  $("left").textContent=diff>0?(diff>=60?`· ${Math.floor(diff/60)} jam ${diff%60} menit lagi`:`· ${diff} menit lagi`):"· waktunya sudah lewat";
}
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),2600)}

$("depart").value=S.depart;
$("depart").onchange=e=>{S.depart=e.target.value||"07:00";save();countdown()};
$("addBtn").onclick=()=>{
  const v=$("newText").value.trim();
  if(!v){toast("Tulis nama barangnya dulu");return}
  S.custom.push({id:Date.now().toString(36),t:v});$("newText").value="";save();render();
};
$("newText").onkeydown=e=>{if(e.key==="Enter")$("addBtn").click()};
$("go").onclick=()=>toast("Semangat kuliahnya hari ini! 🎓");
$("reset").onclick=()=>{S.done={};save();render();toast("Checklist hari ini direset")};

const hr=new Date().getHours();
$("greet").textContent=(hr<11?"Selamat pagi":hr<15?"Selamat siang":hr<18?"Selamat sore":"Selamat malam")+", sudah siap kuliah?";
$("date").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"});
setInterval(countdown,30000);
render();

// Ambil daftar terbaru dari API Python. Jika gagal (mis. dibuka lokal), pakai data bawaan di atas.
fetch("/api/checklist").then(r=>r.ok?r.json():Promise.reject()).then(d=>{
  if(d&&d.base&&d.modes){BASE=d.base;MODES=d.modes;if(!MODES[S.mode])S.mode="Kuliah biasa";render()}
}).catch(()=>{});
