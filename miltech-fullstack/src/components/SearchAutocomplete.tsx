'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface ListingSuggestion {
  id: string;
  title: string;
  price: number;
}

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ListingSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        // Эмуляция API запроса (в реальности здесь был бы fetch)
        const mockData: ListingSuggestion[] = [
          { id: '1', title: `Т-90М "Прорыв" (${query})`, price: 15000000 },
          { id: '2', title: `Су-57 (${query})`, price: 45000000 },
          { id: '3', title: `БМП-3 (${query})`, price: 8500000 },
        ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        
        setSuggestions(mockData.slice(0, 5));
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      router.push(`/listing/${suggestions[highlightedIndex].id}`);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Поиск техники..."
          className="w-full pl-10 pr-4 py-2 bg-secondary border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-white"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              onClick={() => {
                router.push(`/listing/${item.id}`);
                setIsOpen(false);
              }}
              className={`
                px-4 py-3 cursor-pointer flex justify-between items-center
                ${index === highlightedIndex ? 'bg-accent/20 text-accent' : 'hover:bg-gray-700'}
              `}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-400">{(item.price / 1000000).toFixed(1)}M ₽</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
