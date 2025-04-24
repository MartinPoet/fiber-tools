'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import L from 'leaflet'

// Fix für das Standard-Icon (Leaflet-Assets liegen in public/leaflet/)
// hier eine Interface-Cast statt any
interface IconDefaultWithGetIconUrl {
  _getIconUrl?: () => void
}
delete (L.Icon.Default.prototype as IconDefaultWithGetIconUrl)._getIconUrl
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

export default function MunicipalityMap({ lat, lng, gkz }: MapProps) {
  return (
    <MapContainer center={[lat, lng]} zoom={12} className="h-full w-full rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>Gemeinde {gkz}</Popup>
      </Marker>
      {/* hier könnt ihr später euren GeoJSON-Layer einbauen */}
    </MapContainer>
  )
}
