import { Wallet, List, ShoppingCart, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  balance: number;
  listingsCount: number;
  purchasesCount: number;
  salesCount: number;
  totalRevenue?: number;
}

export default function ProfileStats({
  balance,
  listingsCount,
  purchasesCount,
  salesCount,
  totalRevenue = 0,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Баланс',
      value: `${balance.toLocaleString()} ₽`,
      icon: Wallet,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Объявления',
      value: listingsCount.toString(),
      icon: List,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Покупки',
      value: purchasesCount.toString(),
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Продажи',
      value: salesCount.toString(),
      icon: TrendingUp,
      color: 'text-[var(--accent)]',
      bgColor: 'bg-[var(--accent)]/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[var(--bg-secondary)] rounded-xl p-4 flex flex-col items-center text-center hover:bg-[var(--bg-secondary)]/80 transition-colors"
        >
          <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className={`text-xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
