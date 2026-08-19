import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const has3D = searchParams.get('has3D');
    const hasBlueprint = searchParams.get('hasBlueprint');
    const sort = searchParams.get('sort') || 'newest';

    // Базовый запрос
    const where: any = {};

    // Фильтр по категории
    if (category && category !== 'all') {
      if (category === 'demilitarized') {
        // Для демилитаризованной техники фильтруем по ключевым словам в категории или title
        where.OR = [
          { category: { contains: 'tank', mode: 'insensitive' } },
          { title: { contains: 'демилитаризован', mode: 'insensitive' } },
        ];
      } else {
        where.category = { contains: category, mode: 'insensitive' };
      }
    }

    // Поиск по названию и описанию
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Фильтр по цене
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    // Фильтры по наличию 3D и чертежей
    if (has3D === 'true') {
      where.has3D = true;
    }
    if (hasBlueprint === 'true') {
      where.hasBlueprint = true;
    }

    // Получаем данные
    let listings = await prisma.listing.findMany({
      where,
      include: {
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Преобразуем данные в формат совместимый с фронтендом
    const formattedListings = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      category: listing.category.toLowerCase(),
      categoryLabel: getCategoryLabel(listing.category),
      price: listing.price,
      location: listing.location,
      coordinates: [listing.latitude || 55.7558, listing.longitude || 37.6173],
      status: mapStatus(listing.status),
      statusLabel: mapStatusLabel(listing.status),
      year: listing.year || new Date().getFullYear(),
      combatWeight: listing.combatWeight || 0,
      country: listing.country || 'Россия',
      image: listing.imageUrl || 'https://via.placeholder.com/800x600/1a2332/9ca3af?text=No+Image',
      attributes: listing.attributes || {},
      description: listing.description,
      has3D: listing.has3D,
      hasBlueprint: listing.hasBlueprint,
      compatible: listing.compatible || [],
    }));

    // Сортировка на стороне сервера (дополнительно)
    if (sort === 'price_asc') {
      formattedListings.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      formattedListings.sort((a, b) => b.price - a.price);
    } else if (sort === 'weight') {
      formattedListings.sort((a, b) => b.combatWeight - a.combatWeight);
    } else if (sort === 'newest') {
      formattedListings.sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime());
    }

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка объявлений' },
      { status: 500 }
    );
  }
}

// Вспомогательные функции
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tank: 'Основной боевой танк',
    aircraft: 'Фронтовой истребитель',
    naval: 'Морская техника',
    parts: 'Запчасти и агрегаты',
  };
  return labels[category.toLowerCase()] || 'Военная техника';
}

function mapStatus(status: string): string {
  const mapping: Record<string, string> = {
    ACTIVE: 'active',
    SOLD: 'sold',
    ARCHIVED: 'archived',
  };
  return mapping[status] || 'active';
}

function mapStatusLabel(status: string): string {
  const mapping: Record<string, string> = {
    ACTIVE: 'Боеготовая',
    SOLD: 'Продано',
    ARCHIVED: 'Архив',
  };
  return mapping[status] || 'Боеготовая';
}
