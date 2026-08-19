'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const MarkerClusterGroup = dynamic(() => import('react-leaflet-markercluster'), { ssr: false });

interface ListingPoint {
  id: string;
  title: string;
  price: number;
  category: string;
  latitude: number;
  longitude: number;
}

export default function MapPage() {
  const [listings, setListings] = useState<ListingPoint[]>([]);
  const [filterCat, setFilterCat] = useState('ALL');

  useEffect(() => {
    const mockData: ListingPoint[] = [
      { id: '1', title: 'Т-90М', price: 15000000, category: 'TANK', latitude: 55.7558, longitude: 37.6173 },
      { id: '2', title: 'Су-57', price: 45000000, category: 'AIRCRAFT', latitude: 59.9343, longitude: 30.3351 },
      { id: '3', title: 'БМП-3', price: 8500000, category: 'TANK', latitude: 55.7558, longitude: 37.6173 },
      { id: '4', title: 'Калибр-М', price: 2000000, category: 'WEAPONS', latitude: 45.0355, longitude: 38.9753 },
    ];
    setListings(mockData);
  }, []);

  const filtered = filterCat === 'ALL' ? listings : listings.filter(l => l.category === filterCat);

  return (
    <div className="h-[calc(100vh-80px)] w-full relative">
      <div className="absolute top-4 left-4 z-[1000] bg-secondary p-4 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-2">Карта вооружений</h2>
        <select 
          value={filterCat} 
          onChange={(e) => setFilterCat(e.target.value)}
          className="w-full p-2 bg-primary border border-gray-600 rounded mb-2"
        >
          <option value="ALL">Все категории</option>
          <option value="TANK">Танки</option>
          <option value="AIRCRAFT">Авиация</option>
          <option value="NAVAL">Флот</option>
          <option value="WEAPONS">Оружие</option>
        </select>
        <div className="text-sm text-gray-400">Найдено: {filtered.length}</div>
      </div>

      <MapContainer center={[55.7558, 37.6173]} zoom={5} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup>
          {filtered.map(item => (
            <Marker key={item.id} position={[item.latitude, item.longitude]}>
              <Popup>
                <div className="text-gray-900">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-accent font-mono">{(item.price / 1000000).toFixed(1)}M ₽</p>
                  <a href={`/listing/${item.id}`} className="text-blue-600 underline text-sm">Подробнее</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
