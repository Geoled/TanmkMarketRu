export default async function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">MilTech Marketplace</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Добро пожаловать на платформу военной техники и оборудования
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo card linking to listing */}
          <a 
            href="/listing/demo-listing-id"
            className="block bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:ring-2 hover:ring-[var(--accent)] transition-all"
          >
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Пример объявления</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Нажмите чтобы просмотреть страницу деталей
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
