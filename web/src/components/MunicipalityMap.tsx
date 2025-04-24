// web/src/components/MunicipalityMap.tsx
'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap
} from 'react-leaflet'
import { useState, useEffect } from 'react'
import type { GeoJsonObject } from 'geojson'

// Fix für das Standard-Icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapProps {
  lat: number
  lng: number
  gkz: string
}

//  ──────────────────────────────────────────────────────────────
//  FitBounds: passt die Karte automatisch auf das Polygon an
//  ──────────────────────────────────────────────────────────────
function FitBounds({ data }: { data: GeoJsonObject }) {
  const map = useMap()
  useEffect(() => {
    if (data) {
      // Erstelle einen temporären Layer, um die Bounds zu ermitteln
      const layer = L.geoJSON(data as any)
      map.fitBounds(layer.getBounds(), { padding: [20, 20] })
    }
  }, [data, map])
  return null
}

export default function MunicipalityMap({ lat, lng, gkz }: MapProps) {
  const [geoJson, setGeoJson] = useState<GeoJsonObject | null>(null)

  useEffect(() => {
    console.log(`🔄 Laden der GeoJSON-Grenze für GKZ ${gkz}…`)
    fetch(`/api/municipality/geo?gkz=${gkz}`)
      .then(res => {
        console.log('Geo-Response Status:', res.status)
        if (!res.ok) throw new Error(`Grenze nicht gefunden (${res.status})`)
        return res.json()
      })
      .then((data: GeoJsonObject) => {
        console.log('GeoJSON geladen:', data)
        setGeoJson(data)
      })
      .catch(err => {
        console.error('Fehler beim Laden der GeoJSON:', err)
        setGeoJson(null)
      })
  }, [gkz])

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={12}
      className="h-64 w-full rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap-Mitwirkende"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]}>
        <Popup>Gemeindezentrum</Popup>
      </Marker>

      {geoJson && (
        <>
          {/* passt die Ansicht so an, dass das Polygon komplett sichtbar ist */}
          <FitBounds data={geoJson} />

          {/* Polygon selbst, mit Kontur + leichter Füllung */}
          <GeoJSON
            data={geoJson}
            style={() => ({
              color: '#ff6600',      // Randfarbe
              weight: 2,             // Linienbreite
              fillColor: '#ff6600',  // Füllfarbe
              fillOpacity: 0.15      // Transparenz
            })}
          />
        </>
      )}
    </MapContainer>
  )
}
