import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Wallet, PlusCircle } from 'lucide-react';
import ProfileStats from '@/components/ProfileStats';
import TransactionList from '@/components/TransactionList';
import FadeIn from '@/components/FadeIn';

const prisma = new PrismaClient();

// Для MVP - захардкоженный ID пользователя из seed.ts
const CURRENT_USER_ID = 'user-1';

export default async function ProfilePage() {
  // Получаем данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
    include: {
      listings: {
        include: {
          transactions: true,
        },
      },
      transactions: {
        include: {
          listing: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  // Подсчет статистики
  const listingsCount = user.listings.length;
  
  // Покупки - транзакции где пользователь buyer
  const purchases = user.transactions.filter(tx => tx.buyerId === user.id);
  const purchasesCount = purchases.length;
  
  // Продажи - транзакции на объявления пользователя
  const sales = user.listings.flatMap(listing => listing.transactions);
  const salesCount = sales.length;
  
  // Общий оборот от продаж
  const totalRevenue = sales.reduce((sum, tx) => sum + tx.listing.price, 0);

  // Транзакции для отображения (покупки и продажи)
  const allTransactions = [
    ...purchases.map(tx => ({
      ...tx,
      isBuyer: true,
    })),
    ...sales.map(tx => ({
      ...tx,
      isBuyer: false,
    })),
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок профиля */}
        <FadeIn>
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.name || user.email}
                </h1>
                <p className="text-[var(--text-secondary)]">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                    user.role === 'MODERATOR' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {user.role === 'ADMIN' ? 'Администратор' :
                     user.role === 'MODERATOR' ? 'Модератор' : 'Пользователь'}
                  </span>
                </div>
              </div>
              
              {/* Кнопка пополнения баланса */}
              <button
                onClick={async () => {
                  const response = await fetch(`/api/users/${user.id}/topup`, {
                    method: 'POST',
                  });
                  if (response.ok) {
                    window.location.reload();
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold rounded-xl transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Пополнить (+50M ₽)
              </button>
            </div>

            {/* Баланс крупно */}
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Текущий баланс</p>
                <p className="text-4xl font-bold text-white">
                  {(user.balance || 0).toLocaleString()} ₽
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Статистика */}
        <FadeIn delay={100}>
          <ProfileStats
            balance={user.balance || 0}
            listingsCount={listingsCount}
            purchasesCount={purchasesCount}
            salesCount={salesCount}
            totalRevenue={totalRevenue}
          />
        </FadeIn>

        {/* Мои объявления */}
        <FadeIn delay={200}>
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Мои объявления</h2>
            {user.listings.length > 0 ? (
              <div className="space-y-3">
                {user.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-[var(--bg-primary)] rounded-xl p-4 flex items-center justify-between hover:bg-[var(--bg-primary)]/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {listing.imageUrl && (
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-semibold">{listing.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {listing.category} • {listing.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--accent)]">
                        {listing.price.toLocaleString()} ₽
                      </p>
                      <a
                        href={`/listing/${listing.id}`}
                        className="text-sm text-[var(--text-secondary)] hover:text-white"
                      >
                        Просмотреть
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-secondary)] text-center py-8">
                У вас пока нет объявлений
              </p>
            )}
          </div>
        </FadeIn>

        {/* История транзакций */}
        <FadeIn delay={300}>
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">История транзакций</h2>
            <TransactionList transactions={allTransactions} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
