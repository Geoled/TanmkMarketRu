'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ListingMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

export default function ListingMap({ latitude, longitude, title, location }: ListingMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let map: L.Map | null = null;
    let marker: L.Marker | null = null;

    const initMap = async () => {
      try {
        // Fix for default marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        map = L.map('map-container').setView([latitude, longitude], 13);

        // Dark matter tiles from CartoDB
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);

        marker = L.marker([latitude, longitude]).addTo(map);
        
        const popupContent = `
          <div style="color: #1a2332; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600;">${title}</h3>
            <p style="margin: 0; color: #666;">${location}</p>
          </div>
        `;
        
        marker.bindPopup(popupContent).openPopup();

        setMapLoaded(true);
      } catch (err) {
        setError('Ошибка загрузки карты');
        console.error('Map initialization error:', err);
      }
    };

    initMap();

    return () => {
      if (marker) {
        marker.remove();
      }
      if (map) {
        map.remove();
      }
    };
  }, [latitude, longitude, title, location]);

  if (error) {
    return (
      <div className="w-full h-[400px] bg-[var(--bg-primary)] flex items-center justify-center rounded-xl">
        <div className="text-center text-[var(--text-secondary)]">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="map-container" 
      className="w-full h-[400px] rounded-xl"
      style={{ zIndex: 0 }}
    />
  );
}
