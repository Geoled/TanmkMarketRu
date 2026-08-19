'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
  combatWeight?: number;
}

function HomePageContent({ searchParams }: { searchParams: { page?: string; sort?: string; category?: string } }) {
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || 'newest';
  const category = searchParams.category || 'ALL';
  const limit = 12;

  // Эмуляция данных (замените на реальный Prisma запрос)
  const allListings: Listing[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `listing-${i}`,
    title: `Военный объект #${i}`,
    price: Math.floor(Math.random() * 50000000) + 1000000,
    location: 'Москва',
    imageUrl: '/placeholder.jpg',
    category: ['TANK', 'AIRCRAFT', 'NAVAL'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - i * 86400000),
    combatWeight: 20 + i
  }));

  // Фильтрация
  let filtered = allListings;
  if (category !== 'ALL') filtered = filtered.filter(l => l.category === category);

  // Сортировка
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'weight_desc') filtered.sort((a, b) => (b.combatWeight || 0) - (a.combatWeight || 0));
  if (sort === 'newest') filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Пагинация
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Панель фильтров и сортировки */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between items-center bg-secondary p-4 rounded-lg">
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'TANK', 'AIRCRAFT', 'NAVAL'].map(cat => (
            <Link 
              key={cat} 
              href={`/?category=${cat}&sort=${sort}&page=1`}
              className={`px-3 py-1 rounded-full text-sm ${category === cat ? 'bg-accent text-white' : 'bg-primary hover:bg-gray-700'}`}
            >
              {cat === 'ALL' ? 'Все' : cat}
            </Link>
          ))}
        </div>
        
        <select 
          value={sort}
          onChange={(e) => window.location.href = `/?category=${category}&sort=${e.target.value}&page=1`}
          className="bg-primary border border-gray-700 rounded px-3 py-1 text-sm"
        >
          <option value="newest">Сначала новые</option>
          <option value="price_asc">Цена: низкая → высокая</option>
          <option value="price_desc">Цена: высокая → низкая</option>
          <option value="weight_desc">По массе</option>
        </select>
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginated.map(listing => (
          <Link 
            key={listing.id} 
            href={`/listing/${listing.id}`}
            className="block bg-secondary rounded-xl overflow-hidden border border-gray-800 group hover:border-accent/50 transition-all"
          >
            <div className="relative h-48">
              <Image 
                src={listing.imageUrl} 
                alt={listing.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{listing.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-accent font-mono font-bold">{(listing.price / 1000000).toFixed(1)}M ₽</span>
                <span className="text-xs text-gray-400">{listing.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/?page=${page - 1}&sort=${sort}&category=${category}`} className="px-4 py-2 bg-secondary rounded hover:bg-accent">←</Link>
          )}
          <span className="px-4 py-2 text-gray-400">Стр. {page} из {totalPages}</span>
          {page < totalPages && (
            <Link href={`/?page=${page + 1}&sort=${sort}&category=${category}`} className="px-4 py-2 bg-secondary rounded hover:bg-accent">→</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage({ searchParams }: { searchParams: { page?: string; sort?: string; category?: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Загрузка...</div>}>
      <HomePageContent searchParams={searchParams} />
    </Suspense>
  );
}
