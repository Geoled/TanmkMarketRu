'use server';

import { prisma } from '@/lib/prisma';
import { Category, ListingStatus } from '@prisma/client';

interface CreateListingData {
  title: string;
  description: string;
  category: Category;
  price: number;
  location: string;
  year: number;
  latitude: number;
  longitude: number;
  attributes: Record<string, any>;
  imageUrl: string;
  has3D: boolean;
  hasBlueprint: boolean;
  compatible: string[];
}

export async function createListing(data: CreateListingData) {
  try {
    // Валидация данных
    if (!data.title.trim()) {
      return { success: false, error: 'Название обязательно', listingId: null };
    }

    if (!data.description.trim()) {
      return { success: false, error: 'Описание обязательно', listingId: null };
    }

    if (!data.category) {
      return { success: false, error: 'Категория обязательна', listingId: null };
    }

    if (data.price <= 0) {
      return { success: false, error: 'Цена должна быть положительным числом', listingId: null };
    }

    if (!data.location.trim()) {
      return { success: false, error: 'Локация обязательна', listingId: null };
    }

    if (data.year < 1900 || data.year > new Date().getFullYear()) {
      return { success: false, error: 'Некорректный год', listingId: null };
    }

    // Для MVP используем хардкодный ID продавца из seed.ts
    // В реальном приложении нужно брать из сессии пользователя
    const sellerId = 'user-1'; // Заменить на реальный ID из сессии

    // Создаем объявление
    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        year: data.year,
        status: ListingStatus.ACTIVE,
        imageUrl: data.imageUrl,
        has3D: data.has3D,
        hasBlueprint: data.hasBlueprint,
        compatible: data.compatible,
        attributes: data.attributes,
        sellerId: sellerId,
      },
    });

    return { success: true, error: null, listingId: listing.id };
  } catch (error) {
    console.error('Ошибка при создании объявления:', error);
    return { 
      success: false, 
      error: 'Произошла ошибка при создании объявления. Попробуйте позже.', 
      listingId: null 
    };
  }
}
