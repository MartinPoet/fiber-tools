'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const BASEMAP_URL =
  'https://mapsneu.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png'

interface GemeindeMapProps {
  gkz: string
  center?: { lat: number; lng: number }
}

interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
  properties: Record<string, unknown>
}

interface GeoJSON {
  type: 'FeatureCollection' | 'Feature'
  features?: GeoJSONFeature[]
  geometry?: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

export default function GemeindeMap({ gkz, center }: GemeindeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Default center is Austria's center if not provided
    const initialCenter: [number, number] = center
      ? [center.lng, center.lat]
      : [13.35, 47.7]

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: 'raster',
            tiles: [BASEMAP_URL],
            tileSize: 256,
            attribution: '&copy; <a href="https://basemap.at">basemap.at</a>',
          },
        },
        layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
      },
      center: initialCenter,
      zoom: 11,
      maxZoom: 16,
      minZoom: 6,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Load gemeente boundary
    map.current.on('load', async () => {
      if (!map.current) return

      try {
        const res = await fetch(`/api/municipality/geo?gkz=${gkz}`)
        if (!res.ok) return

        const geojson: GeoJSON = await res.json()

        map.current.addSource('gemeente-boundary', {
          type: 'geojson',
          data: geojson as GeoJSON.GeoJSON,
        })

        // Fill layer with transparent fill
        map.current.addLayer({
          id: 'gemeente-fill',
          type: 'fill',
          source: 'gemeente-boundary',
          paint: {
            'fill-color': '#0d9488',
            'fill-opacity': 0.15,
          },
        })

        // Border line
        map.current.addLayer({
          id: 'gemeente-border',
          type: 'line',
          source: 'gemeente-boundary',
          paint: {
            'line-color': '#0d9488',
            'line-width': 3,
          },
        })

        // Calculate bounds and fit
        const bounds = new maplibregl.LngLatBounds()

        function addCoordinatesToBounds(coords: number[][][]) {
          for (const ring of coords) {
            for (const coord of ring) {
              bounds.extend([coord[0], coord[1]])
            }
          }
        }

        // Handle both Feature and FeatureCollection
        if (geojson.type === 'FeatureCollection' && geojson.features) {
          for (const feature of geojson.features) {
            if (feature.geometry.type === 'Polygon') {
              addCoordinatesToBounds(feature.geometry.coordinates as number[][][])
            } else if (feature.geometry.type === 'MultiPolygon') {
              for (const polygon of feature.geometry.coordinates as number[][][][]) {
                addCoordinatesToBounds(polygon)
              }
            }
          }
        } else if (geojson.type === 'Feature' && geojson.geometry) {
          if (geojson.geometry.type === 'Polygon') {
            addCoordinatesToBounds(geojson.geometry.coordinates as number[][][])
          } else if (geojson.geometry.type === 'MultiPolygon') {
            for (const polygon of geojson.geometry.coordinates as number[][][][]) {
              addCoordinatesToBounds(polygon)
            }
          }
        }

        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: 40,
            maxZoom: 14,
          })
        }
      } catch (err) {
        console.error('Failed to load gemeente boundary:', err)
      }
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [gkz, center])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  )
}
