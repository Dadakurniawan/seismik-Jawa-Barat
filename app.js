const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const D0={y1:1931,y2:2026,m1:3.4,m2:6.5,d1:0,d2:330,q:''};
let ALL=[],F=[],f={...D0},map,grp,heat,tile,mode='titik',tab='peta',xm='lo',sk='t',sd=-1,charts={},timer,dip;
const dc=d=>d<70?'#ef4444':d<150?'#f59e0b':d<300?'#22d3ee':'#a78bfa';
const dt=t=>new Date(t).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const pop=e=>`<b>M ${e.m.toFixed(1)}</b> (${e.mt})<br>${dt(e.t)}<br>Kedalaman ${e.d} km<br>${e.la.toFixed(3)}, ${e.lo.toFixed(3)}<br><small>${e.p}</small>`;
const hist=(a,lo,st,n)=>{const h=Array(n).fill(0);a.forEach(v=>{const i=Math.min(n-1,Math.floor((v-lo)/st+1e-9));if(i>=0)h[i]++});return h};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;$('#inst').hidden=false});
$('#inst').onclick=()=>{dip&&dip.prompt();$('#inst').hidden=true};
fetch('data.json').then(r=>r.json()).then(d=>{ALL=d;ini()});
function ini(){
 map=L.map('map').setView([-7.1,107.7],8);grp=L.layerGroup().addTo(map);
 setTheme(localStorage.getItem('th')||'dark');
 for(const k of Object.keys(D0))$('#'+k).oninput=e=>{const v=e.target.value;f[k]=k==='q'?v.toLowerCase().trim():(v===''?D0[k]:+v);if(k==='y2'){$('#tl').value=f.y2;$('#tlv').textContent=f.y2}apply()};
 $('#tl').oninput=e=>setY2(+e.target.value);
 $('#rst').onclick=()=>{f={...D0};for(const k in D0)$('#'+k).value=D0[k];setY2(2026)};
 $('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
 $('#filtBtn').onclick=()=>$('#side').classList.toggle('open');
 $$('#tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.t));
 $('#mt').onclick=()=>setMode('titik');$('#mh').onclick=()=>setMode('heat');
 $('#xl').onclick=()=>{xm='lo';$('#xl').classList.add('on');$('#xa').classList.remove('on');drawCross()};
 $('#xa').onclick=()=>{xm='la';$('#xa').classList.add('on');$('#xl').classList.remove('on');drawCross()};
 $('#play').onclick=()=>{if(timer){clearInterval(timer);timer=null;$('#play').textContent='▶';return}
  if(f.y2>=2026)setY2(f.y1);$('#play').textContent='⏸';
  timer=setInterval(()=>{if(f.y2>=2026){$('#play').onclick();return}setY2(f.y2+1)},220)};
 $('#tb').onclick=e=>{const h=e.target.closest('th'),r=e.target.closest('tbody tr');
  if(h){const k=h.dataset.k;sd=sk===k?-sd:1;sk=k;drawTable()}
  else if(r){const x=ALL[+r.dataset.i];showTab('peta');map.flyTo([x.la,x.lo],10);L.popup().setLatLng([x.la,x.lo]).setContent(pop(x)).openOn(map)}};
 $('#csv').onclick=()=>{const rows=F.map(e=>[new Date(e.t).toISOString(),e.la,e.lo,e.d,e.m,e.mt,`"${e.p}"`].join(','));
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+['waktu_utc,lintang,bujur,kedalaman_km,magnitudo,tipe_mag,lokasi',...rows].join('\n')],{type:'text/csv'}));a.download='gempa_jabar_filter.csv';a.click()};
 apply();
}
function setTheme(v){document.documentElement.dataset.theme=v;localStorage.setItem('th',v);$('#theme').textContent=v==='dark'?'☀':'☾';
 document.querySelector('meta[name=theme-color]').content=css('--bg');
 if(tile)map.removeLayer(tile);
 tile=L.tileLayer(`https://{s}.basemaps.cartocdn.com/${v==='dark'?'dark_all':'light_all'}/{z}/{x}/{y}{r}.png`,{subdomains:'abcd',maxZoom:12,attribution:'© OpenStreetMap © CARTO'}).addTo(map);tile.bringToBack();
 if(ALL.length&&tab!=='peta')render()}
function setY2(v){f.y2=v;$('#y2').value=v;$('#tl').value=v;$('#tlv').textContent=v;apply()}
function setMode(m){mode=m;$('#mt').classList.toggle('on',m==='titik');$('#mh').classList.toggle('on',m==='heat');drawMap()}
function showTab(t){tab=t;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$$('.view').forEach(s=>s.hidden=s.id!==t);$('#side').classList.remove('open');if(t==='peta')map.invalidateSize();render()}
function apply(){F=ALL.filter(e=>e.y>=f.y1&&e.y<=f.y2&&e.m>=f.m1-1e-9&&e.m<=f.m2+1e-9&&e.d>=f.d1&&e.d<=f.d2&&(!f.q||e.p.toLowerCase().includes(f.q)));kpi();render()}
function kpi(){const n=F.length,mx=n&&F.reduce((a,b)=>b.m>a.m?b:a),lt=n&&F.reduce((a,b)=>b.t>a.t?b:a),av=n?F.reduce((s,e)=>s+e.d,0)/n:0;
 $('#kpi').innerHTML=[['Jumlah gempa',`${n} / ${ALL.length}`],['Magnitudo maks',n?'M '+mx.m.toFixed(1):'–'],['Rata² kedalaman',n?av.toFixed(0)+' km':'–'],['Terbaru',n?dt(lt.t):'–']].map(([a,b])=>`<div class="k"><small>${a}</small><b>${b}</b></div>`).join('')}
function render(){({peta:drawMap,stat:drawStats,cross:drawCross,tabel:drawTable})[tab]()}
function drawMap(){grp.clearLayers();if(heat){map.removeLayer(heat);heat=null}
 if(mode==='titik')F.forEach(e=>L.circleMarker([e.la,e.lo],{radius:2+(e.m-3)*3.2,color:'#fff',weight:.6,fillColor:dc(e.d),fillOpacity:.78}).bindPopup(pop(e)).addTo(grp));
 else heat=L.heatLayer(F.map(e=>[e.la,e.lo,(e.m-3)/3.5]),{radius:28,blur:22,minOpacity:.35,gradient:{.2:'#22d3ee',.5:'#facc15',.8:'#f97316',1:'#ef4444'}}).addTo(map)}
function ch(id,cfg){charts[id]&&charts[id].destroy();Chart.defaults.color=css('--mut');Chart.defaults.borderColor=css('--line');
 cfg.options=Object.assign({responsive:true,maintainAspectRatio:false},cfg.options);charts[id]=new Chart($('#'+id),cfg)}
function drawStats(){const ac=css('--acc'),nl={plugins:{legend:{display:false}}};
 const dec=[1930,1940,1950,1960,1970,1980,1990,2000,2010,2020];
 ch('c1',{type:'bar',data:{labels:dec.map(d=>d+'-an'),datasets:[{data:dec.map(d=>F.filter(e=>e.y>=d&&e.y<d+10).length),backgroundColor:ac}]},options:nl});
 ch('c2',{type:'bar',data:{labels:Array.from({length:16},(_,i)=>(3.4+i*.2).toFixed(1)),datasets:[{data:hist(F.map(e=>e.m),3.4,.2,16),backgroundColor:ac}]},options:nl});
 ch('c3',{type:'bar',data:{labels:Array.from({length:14},(_,i)=>i*25+'–'+(i*25+25)),datasets:[{data:hist(F.map(e=>e.d),0,25,14),backgroundColor:'#f59e0b'}]},options:nl});
 const ms=F.map(e=>e.m);let ds=[],info='Data terlalu sedikit (min. 20 gempa) untuk estimasi b-value.';
 if(ms.length>=20){const h=hist(ms,3.4,.1,32),mc=Math.round((3.4+h.indexOf(Math.max(...h))*.1)*10)/10,sel=ms.filter(m=>m>=mc-.001),mean=sel.reduce((a,b)=>a+b,0)/sel.length,b=Math.LOG10E/(mean-(mc-.05)),mx=Math.max(...ms),pts=[];
  for(let M=3.4;M<=mx+.001;M+=.1){const N=ms.filter(m=>m>=M-.001).length;if(N)pts.push({x:+M.toFixed(1),y:Math.log10(N)})}
  ds=[{type:'scatter',data:pts,backgroundColor:ac,pointRadius:3},{type:'line',data:[{x:mc,y:Math.log10(sel.length)},{x:mx,y:Math.log10(sel.length)-b*(mx-mc)}],borderColor:'#ef4444',borderDash:[6,4],pointRadius:0}];
  info=`Mc ≈ ${mc.toFixed(1)} · b-value ≈ ${b.toFixed(2)} (Aki-Utsu, n=${sel.length}). Garis merah = kecocokan di atas Mc.`}
 $('#gr').textContent=info;
 ch('c4',{type:'scatter',data:{datasets:ds},options:{plugins:{legend:{display:false}},scales:{x:{title:{display:true,text:'Magnitudo (M)'}},y:{title:{display:true,text:'log₁₀ N (≥M)'}}}}});
 ch('c5',{type:'scatter',data:{datasets:[{data:F.map(e=>({x:e.y+(e.t-Date.UTC(e.y,0,1))/3.15576e10,y:e.m})),backgroundColor:F.map(e=>dc(e.d)),pointRadius:3.5}]},options:{plugins:{legend:{display:false}},scales:{x:{title:{display:true,text:'Tahun'}},y:{title:{display:true,text:'Magnitudo'}}}}})}
function drawCross(){ch('c6',{type:'scatter',data:{datasets:[{data:F.map(e=>({x:e[xm],y:e.d,e})),backgroundColor:F.map(e=>dc(e.d)+'bb'),pointRadius:F.map(e=>2+(e.m-3.4)*2.2)}]},
 options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>{const e=c.raw.e;return `M${e.m.toFixed(1)} · ${e.d} km · ${dt(e.t)} · ${e.p}`}}}},scales:{y:{reverse:true,title:{display:true,text:'Kedalaman (km)'}},x:{title:{display:true,text:xm==='lo'?'Bujur (° BT)':'Lintang (°, negatif = selatan)'}}}}})}
const cols=[['t','Tanggal'],['m','Mag'],['d','Kedalaman (km)'],['la','Lintang'],['lo','Bujur'],['p','Lokasi'],['mt','Tipe']];
function drawTable(){const a=[...F].sort((x,y)=>(x[sk]>y[sk]?1:x[sk]<y[sk]?-1:0)*sd);
 $('#tb').innerHTML=`<thead><tr>${cols.map(([k,l])=>`<th data-k="${k}">${l}${k===sk?(sd>0?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody>`+a.map(e=>`<tr data-i="${e.i}"><td>${dt(e.t)}</td><td><span class="dot" style="background:${dc(e.d)}"></span>${e.m.toFixed(1)}</td><td>${e.d}</td><td>${e.la.toFixed(3)}</td><td>${e.lo.toFixed(3)}</td><td>${e.p}</td><td>${e.mt}</td></tr>`).join('')+'</tbody>';
 $('#cnt').textContent=a.length+' baris (klik baris untuk lihat di peta)'}
