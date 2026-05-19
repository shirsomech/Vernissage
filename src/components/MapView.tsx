'use client'
import { useEffect, useRef } from 'react'
import { Exhibition } from '@/lib/types'
import { MUSEUM_LOCATIONS } from '@/lib/museums'
import styles from './MapView.module.css'

interface Props {
  exhibitions: Exhibition[]
  activeMuseum: string
  onMuseumSelect: (museum: string) => void
}

export default function MapView({ exhibitions, activeMuseum, onMuseumSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet (client-only)
    import('leaflet').then((L) => {
      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [48.862, 2.330],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      updateMarkers(L, map)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then((L) => {
      updateMarkers(L, mapInstanceRef.current)
    })
  }, [exhibitions, activeMuseum])

  function updateMarkers(L: any, map: any) {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    MUSEUM_LOCATIONS.forEach((loc) => {
      const museumExhibitions = exhibitions.filter((e) => e.museum === loc.name)
      const isActive = activeMuseum === 'All' || activeMuseum === loc.name
      const count = museumExhibitions.length

      // Custom div icon
      const iconHtml = `
        <div class="vernissage-marker ${isActive ? 'vernissage-marker--active' : 'vernissage-marker--dim'}">
          <span class="vernissage-marker__count">${count}</span>
        </div>
      `
      const icon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      })

      const marker = L.marker([loc.lat, loc.lng], { icon })

      // Build popup content
      const exHtml = museumExhibitions.length
        ? museumExhibitions.map((ex) => `
            <div class="vernissage-popup__ex">
              <span class="vernissage-popup__dot ${ex.status === 'Ongoing' ? 'vernissage-popup__dot--on' : 'vernissage-popup__dot--up'}"></span>
              <div>
                <strong>${ex.title}</strong>
                ${ex.artist ? `<br/><em>${ex.artist}</em>` : ''}
                <br/><small>${ex.dates}</small>
              </div>
            </div>
          `).join('')
        : '<p class="vernissage-popup__none">No current exhibitions</p>'

      const popupContent = `
        <div class="vernissage-popup">
          <h3 class="vernissage-popup__name">${loc.name}</h3>
          <p class="vernissage-popup__addr">${loc.address} · ${loc.arrondissement} arr.</p>
          <div class="vernissage-popup__list">${exHtml}</div>
          ${museumExhibitions.length ? `<button class="vernissage-popup__btn" onclick="window.__vernissageSelect('${loc.name}')">Filter to this museum →</button>` : ''}
        </div>
      `

      marker.bindPopup(popupContent, { maxWidth: 280, className: 'vernissage-leaflet-popup' })
      marker.addTo(map)
      markersRef.current.push(marker)
    })

    // Expose callback for popup button
    ;(window as any).__vernissageSelect = (museum: string) => {
      onMuseumSelect(museum)
    }
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      {/* Custom marker + popup styles injected globally */}
      <style>{`
        .vernissage-marker {
          width: 40px; height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          transition: opacity 0.2s;
        }
        .vernissage-marker--active { background: #C8432A; }
        .vernissage-marker--dim { background: #B4B2A9; opacity: 0.5; }
        .vernissage-marker__count {
          transform: rotate(45deg);
          color: white; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
        }
        .vernissage-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 12px; padding: 0; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid rgba(26,22,18,0.1);
        }
        .vernissage-leaflet-popup .leaflet-popup-content { margin: 0; }
        .vernissage-leaflet-popup .leaflet-popup-tip-container { display: none; }
        .vernissage-popup { padding: 16px; font-family: 'DM Sans', sans-serif; }
        .vernissage-popup__name {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 400; margin: 0 0 2px;
          color: #1A1612;
        }
        .vernissage-popup__addr {
          font-size: 11px; color: #7A7168; margin: 0 0 12px;
        }
        .vernissage-popup__list { display: flex; flex-direction: column; gap: 10px; }
        .vernissage-popup__ex { display: flex; gap: 8px; align-items: flex-start; }
        .vernissage-popup__dot {
          width: 7px; height: 7px; border-radius: 50%;
          flex-shrink: 0; margin-top: 4px;
        }
        .vernissage-popup__dot--on { background: #2A6B3A; }
        .vernissage-popup__dot--up { background: #B4B2A9; }
        .vernissage-popup__ex strong { font-size: 12px; color: #1A1612; font-weight: 500; }
        .vernissage-popup__ex em { font-size: 11px; color: #7A7168; font-style: italic; }
        .vernissage-popup__ex small { font-size: 11px; color: #7A7168; }
        .vernissage-popup__none { font-size: 12px; color: #B4B2A9; font-style: italic; margin: 0; }
        .vernissage-popup__btn {
          margin-top: 12px; width: 100%;
          background: #F5EBE8; color: #C8432A;
          border: none; border-radius: 6px;
          padding: 7px 12px; font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-align: left;
        }
        .vernissage-popup__btn:hover { background: #F0D9D3; }
      `}</style>
      <div ref={mapRef} className={styles.map} />
    </>
  )
}
