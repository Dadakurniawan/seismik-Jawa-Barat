const V='sjb-v1',T='sjb-tiles',S=['./','index.html','style.css','app.js','data.json','manifest.webmanifest','lib/leaflet.js','lib/leaflet.css','lib/leaflet-heat.js','lib/chart.umd.js','lib/images/layers.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(S)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==T).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const tile=r.url.includes('cartocdn.com');
e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(tile&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(T).then(x=>x.put(r,c))}return res}).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error())))});
