'use client';

import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
  };
  createdAt: string;
  isBuyer: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
}

type FilterStatus = 'all' | 'buyer' | 'seller';

export default function TransactionList({ transactions }: TransactionListProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'buyer') return tx.isBuyer;
    if (filter === 'seller') return !tx.isBuyer;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p>Транзакции не найдены</p>
      </div>
    );
  }

  return (
    <div>
      {/* Фильтры */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          Все
        </button>
        <button
          onClick={() => setFilter('buyer')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'buyer'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          Покупки
        </button>
        <button
          onClick={() => setFilter('seller')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'seller'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          Продажи
        </button>
      </div>

      {/* Список транзакций */}
      <div className="space-y-3">
        {sortedTransactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-[var(--bg-secondary)] rounded-xl p-4 hover:bg-[var(--bg-secondary)]/80 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.isBuyer
                        ? 'bg-purple-500/10 text-purple-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}
                  >
                    {tx.isBuyer ? 'Покупка' : 'Продажа'}
                  </span>
                  <h4 className="text-white font-semibold">{tx.listing.title}</h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(tx.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {tx.listing.price.toLocaleString()} ₽
                </div>
                <a
                  href={`/listing/${tx.listing.id}`}
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  Просмотреть
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
