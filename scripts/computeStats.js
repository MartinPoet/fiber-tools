// scripts/computeStats.js
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Pfade anpassen
// CSV liegt in web/data
const csvPath = path.join(__dirname, '../web/data/nexiga.csv');
// Output soll in web/data
const outPath = path.join(__dirname, '../web/data/municipalityStats.json');

// 1. CSV einlesen
const text = fs.readFileSync(csvPath, 'utf8');
const parsed = Papa.parse(text, { delimiter: ';', header: true });

// 2. Stats per GKZ berechnen
const stats = {};
parsed.data.forEach(row => {
  const rawG = String(row.GEMNR || '').trim().padStart(5, '0');
  if (!rawG) return;
  const hh = Number(row.HH) || 0;
  const fa = Number(row.ANZFA) || 0;
  const sum = hh + fa;

  if (!stats[rawG]) {
    stats[rawG] = { count: 0, homes: 0, sdu: 0, mdu: 0 };
  }
  stats[rawG].count += 1;
  stats[rawG].homes += sum;
  if (sum > 2) stats[rawG].mdu += 1;
  else stats[rawG].sdu += 1;
});

// 3. Als JSON speichern
fs.writeFileSync(outPath, JSON.stringify(stats, null, 2), 'utf8');
console.log(`Wrote stats for ${Object.keys(stats).length} Gemeinden to ${outPath}`);
