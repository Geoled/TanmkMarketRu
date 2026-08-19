'use client';

import { Radar, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="text-center max-w-md">
        {/* Анимация радара */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Круги радара */}
          <div className="absolute inset-0 border-2 border-[var(--accent)]/30 rounded-full"></div>
          <div className="absolute inset-4 border-2 border-[var(--accent)]/30 rounded-full"></div>
          <div className="absolute inset-8 border-2 border-[var(--accent)]/30 rounded-full"></div>
          <div className="absolute inset-12 border-2 border-[var(--accent)]/30 rounded-full"></div>
          
          {/* Сканирующая линия */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${scanAngle}deg, transparent 0deg, transparent 270deg, var(--accent) 360deg)`,
              opacity: 0.5
            }}
          ></div>
          
          {/* Центральный значок */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-[var(--accent)]" />
          </div>
        </div>

        {/* Текст ошибки */}
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-[var(--text-secondary)] mb-2">
          Объект не найден
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Возможно, он был засекречен или перемещен в другое хранилище
        </p>

        {/* Кнопка возврата */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Radar className="w-5 h-5" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
