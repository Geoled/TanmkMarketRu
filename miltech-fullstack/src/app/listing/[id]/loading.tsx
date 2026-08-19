export default function ListingLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Скелетон изображения */}
        <div className="w-full h-96 bg-[var(--bg-secondary)] rounded-xl animate-pulse mb-8"></div>
        
        {/* Скелетон заголовка и цены */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="h-10 bg-[var(--bg-secondary)] rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-1/2 mb-2 animate-pulse"></div>
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="md:w-48">
            <div className="h-12 bg-[var(--bg-secondary)] rounded w-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Скелетон характеристик */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-8">
          <div className="h-6 bg-[var(--bg-primary)] rounded w-1/4 mb-4 animate-pulse"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between py-3 border-b border-[var(--bg-primary)]">
              <div className="h-4 bg-[var(--bg-primary)] rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-[var(--bg-primary)] rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Скелетон описания */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-8">
          <div className="h-6 bg-[var(--bg-primary)] rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[var(--bg-primary)] rounded w-full animate-pulse"></div>
            <div className="h-4 bg-[var(--bg-primary)] rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-[var(--bg-primary)] rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
        
        {/* Скелетон карты */}
        <div className="h-96 bg-[var(--bg-secondary)] rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
