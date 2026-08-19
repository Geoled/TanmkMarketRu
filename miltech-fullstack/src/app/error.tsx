'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Ошибка приложения:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="text-center max-w-md">
        {/* Иконка ошибки */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Текст ошибки */}
        <h1 className="text-4xl font-bold text-white mb-4">500</h1>
        <p className="text-xl text-[var(--text-secondary)] mb-2">
          Потеряна связь с командным центром
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу или повторить запрос.
        </p>

        {/* Кнопка повторной попытки */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
