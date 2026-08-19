'use client';

import { useState, useEffect } from 'react';

type Category = 'TANK' | 'AIRCRAFT' | 'NAVAL' | 'HELICOPTER' | 'PARTS' | 'WEAPONS';

interface AttributeField {
  key: string;
  label: string;
  type: 'text' | 'number';
  placeholder?: string;
  unit?: string;
}

const categoryFields: Record<Category, AttributeField[]> = {
  TANK: [
    { key: 'cannonCaliber', label: 'Калибр орудия', type: 'number', unit: 'мм' },
    { key: 'enginePower', label: 'Мощность двигателя', type: 'number', unit: 'л.с.' },
    { key: 'maxSpeed', label: 'Макс. скорость', type: 'number', unit: 'км/ч' },
    { key: 'range', label: 'Запас хода', type: 'number', unit: 'км' },
    { key: 'crew', label: 'Экипаж', type: 'number', unit: 'чел.' },
    { key: 'armorType', label: 'Тип брони', type: 'text', placeholder: 'Например: композитная' },
    { key: 'combatWeight', label: 'Боевая масса', type: 'number', unit: 'т' },
  ],
  AIRCRAFT: [
    { key: 'maxSpeed', label: 'Макс. скорость', type: 'number', unit: 'км/ч' },
    { key: 'serviceCeiling', label: 'Практический потолок', type: 'number', unit: 'м' },
    { key: 'range', label: 'Дальность полета', type: 'number', unit: 'км' },
    { key: 'payload', label: 'Боевая нагрузка', type: 'number', unit: 'кг' },
    { key: 'engine', label: 'Двигатель', type: 'text', placeholder: 'Например: ТРДД АЛ-31Ф' },
    { key: 'wingspan', label: 'Размах крыла', type: 'number', unit: 'м' },
  ],
  NAVAL: [
    { key: 'length', label: 'Длина', type: 'number', unit: 'м' },
    { key: 'beam', label: 'Ширина', type: 'number', unit: 'м' },
    { key: 'speed', label: 'Скорость', type: 'number', unit: 'узлов' },
    { key: 'range', label: 'Дальность', type: 'number', unit: 'миль' },
    { key: 'crew', label: 'Экипаж', type: 'number', unit: 'чел.' },
    { key: 'hullMaterial', label: 'Материал корпуса', type: 'text', placeholder: 'Например: сталь' },
  ],
  HELICOPTER: [
    { key: 'engineType', label: 'Тип двигателя', type: 'text', placeholder: 'Например: турбовальный' },
    { key: 'maxSpeed', label: 'Макс. скорость', type: 'number', unit: 'км/ч' },
    { key: 'serviceCeiling', label: 'Практический потолок', type: 'number', unit: 'м' },
    { key: 'liftCapacity', label: 'Грузоподъемность', type: 'number', unit: 'кг' },
    { key: 'capacity', label: 'Вместимость', type: 'number', unit: 'чел.' },
  ],
  PARTS: [
    { key: 'power', label: 'Мощность', type: 'number', unit: 'кВт' },
    { key: 'volume', label: 'Объем', type: 'number', unit: 'л' },
    { key: 'type', label: 'Тип', type: 'text', placeholder: 'Например: двигатель' },
    { key: 'weight', label: 'Масса', type: 'number', unit: 'кг' },
    { key: 'condition', label: 'Состояние', type: 'text', placeholder: 'Например: новое' },
  ],
  WEAPONS: [
    { key: 'caliber', label: 'Калибр', type: 'number', unit: 'мм' },
    { key: 'range', label: 'Дальность', type: 'number', unit: 'м' },
    { key: 'rateOfFire', label: 'Скорострельность', type: 'number', unit: 'выстр/мин' },
    { key: 'weight', label: 'Масса', type: 'number', unit: 'кг' },
    { key: 'type', label: 'Тип оружия', type: 'text', placeholder: 'Например: пушка' },
  ],
};

interface DynamicAttributesProps {
  category: Category;
  onChange: (attributes: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export default function DynamicAttributes({
  category,
  onChange,
  initialValues = {},
}: DynamicAttributesProps) {
  const [attributes, setAttributes] = useState<Record<string, any>>(initialValues);
  const fields = categoryFields[category] || [];

  useEffect(() => {
    // Сбросить атрибуты при смене категории
    setAttributes({});
    onChange({});
  }, [category]);

  const handleChange = (key: string, value: string | number) => {
    const newAttributes = { ...attributes, [key]: value };
    setAttributes(newAttributes);
    onChange(newAttributes);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Характеристики для {category}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              {field.type === 'number' ? (
                <input
                  type="number"
                  value={attributes[field.key] ?? ''}
                  onChange={(e) =>
                    handleChange(field.key, e.target.value ? Number(e.target.value) : '')
                  }
                  placeholder={field.placeholder || '0'}
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors pr-12"
                />
              ) : (
                <input
                  type="text"
                  value={attributes[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                />
              )}
              {field.unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {field.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
