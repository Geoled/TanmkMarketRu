import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-[var(--accent)] animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">Загрузка данных...</p>
      </div>
    </div>
  );
}
