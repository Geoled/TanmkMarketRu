'use client';

import Link from 'next/link';
import { Shield, Heart, Map, GitCompare } from 'lucide-react';
import { useEffect, useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';

export default function Header() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        const ids = JSON.parse(saved);
        setFavCount(ids.length);
      } else {
        setFavCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-accent">
          <Shield className="w-6 h-6" />
          <span>MilTech</span>
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchAutocomplete />
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/map" className="flex items-center gap-1 text-sm text-gray-300 hover:text-accent transition-colors hidden sm:flex">
            <Map size={18} />
            <span>Карта</span>
          </Link>
          <Link href="/compare" className="flex items-center gap-1 text-sm text-gray-300 hover:text-accent transition-colors hidden sm:flex">
            <GitCompare size={18} />
            <span>Сравнение</span>
          </Link>
          <Link href="/favorites" className="relative flex items-center gap-1 text-sm text-gray-300 hover:text-accent transition-colors">
            <Heart size={18} />
            {favCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">
                {favCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className="text-sm text-gray-300 hover:text-accent transition-colors hidden sm:block">
            Профиль
          </Link>
          <Link href="/create" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            Продать
          </Link>
        </nav>
      </div>
    </header>
  );
}
