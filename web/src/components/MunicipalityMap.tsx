'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix für das Standard‑Icon (Leaflet-Assets liegen in public/leaflet/)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapProps {
  lat: number
  lng: number
}

export default function MunicipalityMap({ lat, lng }: MapProps) {
  return (
    <MapContainer center={[lat, lng]} zoom={12} className="h-64 w-full rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>Hier befindet sich die Gemeinde</Popup>
      </Marker>
    </MapContainer>
  )
}
