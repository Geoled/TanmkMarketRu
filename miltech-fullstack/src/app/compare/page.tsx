'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  year: number;
  location: string;
  combatWeight?: number;
  imageUrl: string;
  attributes: Record<string, any>;
}

export default function ComparePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [inputId, setInputId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('compareList');
    if (saved) {
      const ids = JSON.parse(saved);
      if (ids.length > 0) {
         const mockListings: Listing[] = ids.map((id: string, idx: number) => ({
            id,
            title: `Объект #${id} (Тип ${idx + 1})`,
            price: 10000000 * (idx + 1),
            year: 2020 + idx,
            location: ['Москва', 'СПб', 'Екатеринбург'][idx] || 'Unknown',
            combatWeight: 40 + idx * 10,
            imageUrl: '/placeholder.jpg',
            attributes: {
              engine: `Engine Type ${idx + 1}`,
              speed: `${60 + idx * 10} km/h`,
              armor: `${100 + idx * 20} mm`
            }
         }));
         setListings(mockListings);
      }
    }
  }, []);

  useEffect(() => {
    if (listings.length === 0) return;
    const keys = new Set<string>();
    listings.forEach(l => {
      Object.keys(l.attributes || {}).forEach(k => keys.add(k));
    });
    setAllKeys(Array.from(keys));
  }, [listings]);

  const removeListing = (id: string) => {
    const newList = listings.filter(l => l.id !== id);
    setListings(newList);
    localStorage.setItem('compareList', JSON.stringify(newList.map(l => l.id)));
  };

  const clearAll = () => {
    setListings([]);
    localStorage.removeItem('compareList');
  };

  const addListing = () => {
    if (!inputId) return;
    
    const newListing: Listing = {
        id: inputId,
        title: `Новый объект ${inputId}`,
        price: 15000000,
        year: 2023,
        location: 'Москва',
        combatWeight: 45,
        imageUrl: '/placeholder.jpg',
        attributes: { engine: 'V12', speed: '70 km/h' }
    };
    
    if (listings.find(l => l.id === inputId)) return;
    if (listings.length >= 3) return alert('Максимум 3 объекта');

    const newList = [...listings, newListing];
    setListings(newList);
    localStorage.setItem('compareList', JSON.stringify(newList.map(l => l.id)));
    setInputId('');
  };

  if (listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Сравнение техники</h1>
        <p className="text-gray-400 mb-8">Добавьте до 3 объявлений для сравнения характеристик</p>
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <input 
            type="text" 
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Введите ID объявления"
            className="flex-1 px-4 py-2 bg-secondary rounded-lg border border-gray-700"
          />
          <button onClick={addListing} className="px-6 py-2 bg-accent rounded-lg font-medium hover:bg-accent/90">
            Добавить
          </button>
        </div>
        <button onClick={() => router.push('/')} className="mt-8 text-accent hover:underline">
          Перейти к каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Сравнение объектов</h1>
        <button onClick={clearAll} className="flex items-center gap-2 text-red-400 hover:text-red-300">
          <Trash2 size={20} /> Очистить все
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 bg-secondary text-left w-48 sticky left-0 z-10">Характеристика</th>
              {listings.map((l) => (
                <th key={l.id} className="p-4 bg-secondary min-w-[250px] relative group">
                  <button 
                    onClick={() => removeListing(l.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                  <Image src={l.imageUrl} alt={l.title} width={200} height={120} className="rounded-lg mb-3 object-cover w-full h-32" />
                  <div className="font-bold text-lg truncate">{l.title}</div>
                  <div className="text-accent font-mono">{(l.price / 1000000).toFixed(1)}M ₽</div>
                </th>
              ))}
              {listings.length < 3 && (
                <th className="p-4 bg-secondary border-2 border-dashed border-gray-700 min-w-[250px]">
                  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                    <input 
                       type="text" 
                       value={inputId}
                       onChange={(e) => setInputId(e.target.value)}
                       placeholder="ID"
                       className="mb-2 p-2 bg-primary rounded text-center w-24"
                    />
                    <button onClick={addListing} className="p-2 bg-gray-800 rounded-full hover:bg-accent hover:text-white transition-colors">
                      <Plus size={24} />
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Год выпуска', key: 'year' },
              { label: 'Локация', key: 'location' },
              { label: 'Боевая масса (т)', key: 'combatWeight' },
              ...allKeys.map(key => ({ label: key, key }))
            ].map((row, idx) => (
              <tr key={row.key} className={idx % 2 === 0 ? 'bg-primary/50' : 'bg-transparent'}>
                <td className="p-4 font-medium text-gray-400 sticky left-0 bg-inherit">{row.label}</td>
                {listings.map((l) => {
                  const val = l[row.key as keyof Listing] || l.attributes[row.key];
                  const isDifferent = listings.some(other => 
                    (other[row.key as keyof Listing] || other.attributes[row.key]) !== val
                  );
                  return (
                    <td key={l.id} className={`p-4 text-center ${isDifferent && listings.length > 1 ? 'text-accent font-bold' : ''}`}>
                      {val || '-'}
                    </td>
                  );
                })}
                {listings.length < 3 && <td className="p-4"></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
