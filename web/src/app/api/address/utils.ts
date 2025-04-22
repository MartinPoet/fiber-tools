import fs from 'fs'
import path from 'path'

export interface Address {
  PAN_AT: string
  PLZ: string
  ORT: string
  ORTSTEIL: string
  STRASSE: string
  HAUSNR: string
  GEMNR: string
  X_WGS84: string
  Y_WGS84: string
  HH: string
  ANZFA: string
  ALTER_HAUS: string
  KK_HAUS: string
}

const csvPath = path.join(process.cwd(), 'data', 'nexiga.csv')

export function loadAddresses(): Address[] {
  const text = fs.readFileSync(csvPath, 'utf8')
  const lines = text.split(/\r?\n/).filter(Boolean)
  const rawHeaders = lines.shift()!
    .split(';')
    .map(h => h.replace(/^\uFEFF/, '').trim())

  const headers = rawHeaders as (keyof Address)[]

  return lines.map(line => {
    const cols = line.split(';')
    const obj: Partial<Address> = {}
    headers.forEach((h, i) => {
      // cols[i]?.trim() liefert string | undefined, Default '' ist string
      obj[h] = (cols[i]?.trim() ?? '')
    })
    return obj as Address
  })
}
