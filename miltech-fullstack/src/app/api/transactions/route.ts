import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, buyerId } = body;

    if (!listingId || !buyerId) {
      return NextResponse.json(
        { error: 'Необходимо указать listingId и buyerId' },
        { status: 400 }
      );
    }

    // Проверяем существование объявления
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Объявление не найдено' }, { status: 404 });
    }

    if (listing.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Объявление недоступно для покупки' }, { status: 400 });
    }

    // Проверяем, что покупатель не является продавцом
    if (listing.sellerId === buyerId) {
      return NextResponse.json({ error: 'Вы не можете купить собственное объявление' }, { status: 400 });
    }

    // Создаем транзакцию
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId,
      },
      include: {
        listing: true,
        buyer: true,
      },
    });

    // Обновляем статус объявления на SOLD
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'SOLD',
      },
    });

    return NextResponse.json({
      message: 'Покупка успешно оформлена',
      transaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании транзакции' },
      { status: 500 }
    );
  }
}
