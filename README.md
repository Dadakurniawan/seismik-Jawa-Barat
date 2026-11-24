# Seismik Jawa Barat 1931–2026 (PWA)
Fitur: peta titik + heatmap, animasi timeline, filter, statistik (dekade, histogram, Gutenberg-Richter), penampang kedalaman, tabel + export CSV, tema gelap/terang, offline.
## Jalankan lokal
`python3 -m http.server 8000` lalu buka http://localhost:8000 (service worker butuh http/https, bukan file://)
## Deploy
- **GitHub Pages**: upload isi folder ke repo → Settings → Pages → Deploy from branch (main, /root).
- **Netlify**: drag & drop folder ke app.netlify.com/drop.
Peta dasar (CARTO) butuh internet; tile yang pernah dibuka tersimpan untuk offline. Data & UI sepenuhnya offline.
Ubah data: ganti `data.json`, lalu naikkan versi `V` di `sw.js`.
