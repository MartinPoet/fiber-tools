import fs from 'fs';
import path from 'path';

export interface Address {
  PAN_AT: string;
  PLZ: string;
  ORT: string;
  ORTSTEIL: string;
  STRASSE: string;
  HAUSNR: string;
  GEMNR: string;
  X_WGS84: string;
  Y_WGS84: string;
  HH: string;
  ANZFA: string;
  ALTER_HAUS: string;
  KK_HAUS: string;
}

// Pfad zur nexiga.csv im data‑Ordner
const csvPath = path.join(process.cwd(), 'data', 'nexiga.csv');

/**
 * Liest die CSV synchron ein und gibt ein Address‑Array zurück.
 */
export function loadAddresses(): Address[] {
  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  // Header parsen
  const headers = lines.shift()!
    .split(';')
    .map(h => h.replace(/^\uFEFF/, '').trim());

  return lines.map(line => {
    const cols = line.split(';');
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i]?.trim() ?? '';
    });
    return obj as Address;
  });
}
