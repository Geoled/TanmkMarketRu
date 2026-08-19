'use client';

import { useState } from 'react';
import { ShoppingCart, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BuyButtonProps {
  listingId: string;
  listingPrice: number;
  sellerId: string;
  userBalance: number;
  currentUserId: string;
}

export default function BuyButton({
  listingId,
  listingPrice,
  sellerId,
  userBalance,
  currentUserId,
}: BuyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isOwnListing = sellerId === currentUserId;
  const hasEnoughBalance = userBalance >= listingPrice;

  const handleBuy = async () => {
    if (!hasEnoughBalance) {
      setStatus('error');
      setMessage('Недостаточно средств на балансе');
      return;
    }

    if (isOwnListing) {
      setStatus('error');
      setMessage('Нельзя купить собственное объявление');
      return;
    }

    setIsProcessing(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: currentUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при покупке');
      }

      setStatus('success');
      setMessage('Покупка успешно совершена!');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isOwnListing}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
          isOwnListing
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        <ShoppingCart className="w-6 h-6" />
        {isOwnListing ? 'Ваше объявление' : `Купить за ${listingPrice.toLocaleString()} ₽`}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="bg-[var(--bg-secondary)] rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Заголовок */}
            <h3 className="text-2xl font-bold text-white mb-4">
              Подтверждение покупки
            </h3>

            {/* Информация о покупке */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Стоимость:</span>
                <span className="text-white font-semibold">
                  {listingPrice.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Ваш баланс:</span>
                <span className={`font-semibold ${hasEnoughBalance ? 'text-green-500' : 'text-red-500'}`}>
                  {userBalance.toLocaleString()} ₽
                </span>
              </div>
              <div className="border-t border-[var(--bg-primary)] pt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-[var(--text-secondary)]">Баланс после покупки:</span>
                  <span className={`font-bold ${hasEnoughBalance ? 'text-green-500' : 'text-red-500'}`}>
                    {(userBalance - listingPrice).toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>

            {/* Статус сообщения */}
            {status !== 'idle' && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Предупреждение о своей покупке */}
            {isOwnListing && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Вы не можете купить собственное объявление</span>
              </div>
            )}

            {/* Недостаточно средств */}
            {!hasEnoughBalance && !isOwnListing && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Недостаточно средств. Пополните баланс в профиле.</span>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-lg border border-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleBuy}
                disabled={isProcessing || !hasEnoughBalance || isOwnListing}
                className="flex-1 py-3 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  'Подтвердить покупку'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
