'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2 } from 'lucide-react';

interface FavoriteItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const ids = JSON.parse(saved);
      const mockFavs: FavoriteItem[] = ids.map((id: string) => ({
        id,
        title: `Избранный объект ${id}`,
        price: 12000000,
        imageUrl: '/placeholder.jpg'
      }));
      setFavorites(mockFavs);
    }
  }, []);

  const removeFavorite = (id: string) => {
    const newFavs = favorites.filter(f => f.id !== id);
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs.map(f => f.id)));
    window.dispatchEvent(new Event('storage')); 
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Список избранного пуст</h1>
        <p className="text-gray-400 mb-6">Сохраняйте интересную технику, чтобы не потерять её</p>
        <Link href="/" className="inline-block px-6 py-3 bg-accent rounded-lg font-bold hover:bg-accent/90">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" /> Избранное ({favorites.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map(item => (
          <div key={item.id} className="bg-secondary rounded-xl overflow-hidden border border-gray-800 group hover:border-accent/50 transition-all">
            <div className="relative h-48">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <button 
                onClick={() => removeFavorite(item.id)}
                className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-accent font-mono font-bold">{(item.price / 1000000).toFixed(1)}M ₽</span>
                <Link href={`/listing/${item.id}`} className="text-sm text-blue-400 hover:underline">
                  Подробнее →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
