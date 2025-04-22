// scripts/computeStats.js
const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

const csvPath = path.join(__dirname, '../web/data/nexiga.csv')
const outPath = path.join(__dirname, '../web/data/municipalityStats.json')

// 1. CSV einlesen
const text = fs.readFileSync(csvPath, 'utf8')
const parsed = Papa.parse(text, { delimiter: ';', header: true })

// 2. Stats + Geo per Gemeinde aggregieren
const stats = {}
parsed.data.forEach(row => {
  const g = String(row.GEMNR||'').trim().padStart(5,'0')
  if (!g) return
  const hh = Number(row.HH)||0
  const fa = Number(row.ANZFA)||0
  const sum = hh+fa
  const x = parseFloat((row.X_WGS84||'').replace(',','.'))||0
  const y = parseFloat((row.Y_WGS84||'').replace(',','.'))||0

  if (!stats[g]) {
    stats[g] = { count:0, homes:0, sdu:0, mdu:0, sumX:0, sumY:0, geoCount:0 }
  }
  const s = stats[g]
  s.count++
  s.homes += sum
  if (sum>2) s.mdu++  
  else s.sdu++

  if (!isNaN(x)&&!isNaN(y)) {
    s.sumX += x
    s.sumY += y
    s.geoCount++
  }
})

// 3. Endgültige JSON-Struktur schreiben
const out = {}
Object.entries(stats).forEach(([g, s])=>{
  out[g] = {
    count: s.count,
    homes: s.homes,
    sdu: s.sdu,
    mdu: s.mdu,
    lat: s.geoCount ? s.sumY/s.geoCount : null,
    lng: s.geoCount ? s.sumX/s.geoCount : null,
  }
})
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
console.log(`Wrote ${Object.keys(out).length} municipal stats with geodata to ${outPath}`)
