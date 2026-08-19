import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ListingParams {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingParams) {
  const { id } = await params;
  
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: true,
    },
  });

  if (!listing) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'SOLD':
        return 'bg-red-900/50 text-red-400 border-red-700';
      case 'ARCHIVED':
        return 'bg-gray-700/50 text-gray-400 border-gray-600';
      default:
        return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const attributes = listing.attributes as Record<string, any> | null;
  const attributeEntries = attributes ? Object.entries(attributes) : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(listing.status)}`}>
            {listing.status === 'ACTIVE' && 'Активно'}
            {listing.status === 'SOLD' && 'Продано'}
            {listing.status === 'ARCHIVED' && 'Архив'}
          </span>
          {listing.has3D && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-400 border border-blue-700">
              3D Модель
            </span>
          )}
          {listing.hasBlueprint && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-400 border border-purple-700">
              Чертеж
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)]">
                <span className="text-2xl font-semibold text-[var(--accent)]">{formatPrice(listing.price)}</span>
                {listing.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </span>
                )}
                {listing.year && (
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {listing.year} г.
                  </span>
                )}
                {listing.country && (
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    {listing.country}
                  </span>
                )}
              </div>
            </div>

            {/* Attributes Table */}
            {attributeEntries.length > 0 && (
              <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b border-gray-700">Характеристики</h2>
                <div className="divide-y divide-gray-700">
                  {attributeEntries.map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4 p-4 hover:bg-[var(--bg-primary)] transition-colors">
                      <span className="text-[var(--text-secondary)] capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Описание</h2>
              <p className="text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Compatible Components */}
            {listing.compatible && listing.compatible.length > 0 && (
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Совместимые компоненты</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.compatible.map((item: string) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-[var(--bg-primary)] rounded-lg text-sm text-[var(--accent)] border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.latitude && listing.longitude && (
              <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b border-gray-700">Расположение</h2>
                <div className="h-[400px]">
                  <ListingMap
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    title={listing.title}
                    location={listing.location}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Продавец</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
                  {listing.seller.name?.charAt(0).toUpperCase() || listing.seller.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">{listing.seller.name || 'Аноним'}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{listing.seller.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  listing.seller.role === 'ADMIN' ? 'bg-red-900/50 text-red-400' :
                  listing.seller.role === 'MODERATOR' ? 'bg-blue-900/50 text-blue-400' :
                  'bg-gray-700/50 text-gray-400'
                }`}>
                  {listing.seller.role === 'ADMIN' && 'Администратор'}
                  {listing.seller.role === 'MODERATOR' && 'Модератор'}
                  {listing.seller.role === 'USER' && 'Пользователь'}
                </span>
              </div>
              <button
                onClick={() => window.location.href = `mailto:${listing.seller.email}`}
                className="w-full py-3 px-4 bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 border border-gray-600 rounded-lg font-medium transition-colors"
              >
                Связаться с продавцом
              </button>
            </div>

            {/* Buy Button */}
            {listing.status === 'ACTIVE' && (
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 sticky top-4">
                <button
                  onClick={async () => {
                    // Хардкод buyerId для теста (замените на реальный ID пользователя)
                    const buyerId = 'user-seed-id'; 
                    
                    try {
                      const response = await fetch('/api/transactions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ listingId: listing.id, buyerId }),
                      });
                      
                      if (response.ok) {
                        alert('Покупка оформлена!');
                      } else {
                        const error = await response.json();
                        alert(`Ошибка: ${error.message}`);
                      }
                    } catch (error) {
                      alert('Произошла ошибка при покупке');
                    }
                  }}
                  className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-[var(--accent)]/90 rounded-lg font-bold text-white transition-colors shadow-lg hover:shadow-xl"
                >
                  Купить сейчас
                </button>
                <p className="text-xs text-center text-[var(--text-secondary)] mt-3">
                  Нажимая кнопку, вы соглашаетесь с условиями сделки
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Динамический импорт компонента карты
async function ListingMap({ latitude, longitude, title, location }: { 
  latitude: number; 
  longitude: number; 
  title: string; 
  location: string;
}) {
  const MapComponent = (await import('@/components/ListingMap')).default;
  return <MapComponent latitude={latitude} longitude={longitude} title={title} location={location} />;
}
