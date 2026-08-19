'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/app/actions/createListing';
import DynamicAttributes from '@/components/DynamicAttributes';
import ImageUpload from '@/components/ImageUpload';
import Header from '@/components/Header';

type Category = 'TANK' | 'AIRCRAFT' | 'NAVAL' | 'HELICOPTER' | 'PARTS' | 'WEAPONS';

interface FormData {
  title: string;
  description: string;
  category: Category | '';
  price: number | '';
  location: string;
  year: number | '';
  latitude: number | null;
  longitude: number | null;
  attributes: Record<string, any>;
  imageUrl: string;
  has3D: boolean;
  hasBlueprint: boolean;
  compatible: string[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  category: '',
  price: '',
  location: '',
  year: '',
  latitude: null,
  longitude: null,
  attributes: {},
  imageUrl: '',
  has3D: false,
  hasBlueprint: false,
  compatible: [],
};

const categories: Category[] = ['TANK', 'AIRCRAFT', 'NAVAL', 'HELICOPTER', 'PARTS', 'WEAPONS'];

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Название обязательно';
      if (!formData.description.trim()) newErrors.description = 'Описание обязательно';
      if (!formData.category) newErrors.category = 'Выберите категорию';
      if (!formData.price || formData.price <= 0) newErrors.price = 'Цена должна быть положительным числом';
      if (!formData.location.trim()) newErrors.location = 'Локация обязательна';
      if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear()) {
        newErrors.year = `Год должен быть от 1900 до ${new Date().getFullYear()}`;
      }
    }

    if (currentStep === 3) {
      if (!formData.imageUrl) newErrors.imageUrl = 'Загрузите изображение';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAttributesChange = (attributes: Record<string, any>) => {
    handleInputChange('attributes', attributes);
  };

  const handleImageUpload = (url: string) => {
    handleInputChange('imageUrl', url);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Для MVP хардкодим координаты на основе локации
      const mockCoords = { latitude: 55.7558, longitude: 37.6173 }; // Москва по умолчанию

      const result = await createListing({
        ...formData,
        latitude: mockCoords.latitude,
        longitude: mockCoords.longitude,
        price: Number(formData.price),
        year: Number(formData.year),
      });

      if (result.success && result.listingId) {
        router.push(`/listing/${result.listingId}`);
      } else {
        setSubmitError(result.error || 'Ошибка при создании объявления');
      }
    } catch (error) {
      setSubmitError('Произошла непредвиденная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              step >= s
                ? 'bg-accent text-white'
                : 'bg-secondary text-gray-400'
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-secondary rounded-full">
        <div
          className="absolute h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>Информация</span>
        <span>Характеристики</span>
        <span>Фото</span>
        <span>Подтверждение</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4">Базовая информация</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Категория техники *
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value as Category)}
          className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Название объявления *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Например: T-72B3 Основной боевой танк"
          className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Описание *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Подробное описание техники, состояние, история..."
          rows={4}
          className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Цена (₽) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
            min="0"
            className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Год выпуска *
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value ? Number(e.target.value) : '')}
            placeholder="2020"
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Местоположение *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Город, регион"
          className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4">Характеристики</h2>
      {formData.category ? (
        <DynamicAttributes
          category={formData.category as Category}
          onChange={handleAttributesChange}
          initialValues={formData.attributes}
        />
      ) : (
        <p className="text-gray-400">Сначала выберите категорию на предыдущем шаге</p>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4">Фото и документы</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Основное изображение *
        </label>
        <ImageUpload onUpload={handleImageUpload} currentUrl={formData.imageUrl} />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.has3D}
            onChange={(e) => handleInputChange('has3D', e.target.checked)}
            className="w-5 h-5 rounded bg-secondary border-gray-700 text-accent focus:ring-accent"
          />
          <span className="text-gray-300">Есть 3D модель</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasBlueprint}
            onChange={(e) => handleInputChange('hasBlueprint', e.target.checked)}
            className="w-5 h-5 rounded bg-secondary border-gray-700 text-accent focus:ring-accent"
          />
          <span className="text-gray-300">Есть чертежи</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Совместимые компоненты (через запятую)
        </label>
        <input
          type="text"
          onChange={(e) =>
            handleInputChange(
              'compatible',
              e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            )
          }
          placeholder="Например: Двигатель В-92С2, Гусеница РМШ"
          className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4">Подтверждение</h2>

      <div className="bg-secondary rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-accent mb-2">{formData.title}</h3>
          <p className="text-gray-400 text-sm mb-2">Категория: {formData.category}</p>
          <p className="text-white text-xl font-bold">{Number(formData.price).toLocaleString()} ₽</p>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Описание:</h4>
          <p className="text-gray-400 text-sm">{formData.description}</p>
        </div>

        <div className="border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300">Год выпуска:</h4>
            <p className="text-white">{formData.year}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300">Локация:</h4>
            <p className="text-white">{formData.location}</p>
          </div>
        </div>

        {Object.keys(formData.attributes).length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Характеристики:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              {Object.entries(formData.attributes).map(([key, value]) => (
                <li key={key}>
                  <span className="text-gray-500">{key}:</span> {String(value)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.imageUrl && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Изображение:</h4>
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Создать объявление</h1>

        {renderStepIndicator()}

        <div className="bg-secondary rounded-xl p-6 mb-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {submitError && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {submitError}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Создание...' : 'Создать объявление'}
            </button>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
