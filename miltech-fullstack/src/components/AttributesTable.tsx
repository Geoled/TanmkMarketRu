interface AttributesTableProps {
  attributes: Record<string, any>;
}

export default function AttributesTable({ attributes }: AttributesTableProps) {
  const entries = Object.entries(attributes);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-700">Характеристики</h2>
      <div className="divide-y divide-gray-700">
        {entries.map(([key, value]) => (
          <div 
            key={key} 
            className="grid grid-cols-2 gap-4 p-4 hover:bg-[var(--bg-primary)] transition-colors"
          >
            <span className="text-[var(--text-secondary)] capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
