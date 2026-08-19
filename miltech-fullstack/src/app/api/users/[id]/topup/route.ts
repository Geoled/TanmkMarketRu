import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/users/[id]/topup
 * Пополняет баланс пользователя на 50,000,000 кредитов (для тестирования)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Валидация ID пользователя
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, balance: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Пополняем баланс на 50,000,000
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        balance: {
          increment: 50_000_000
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        balance: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Баланс успешно пополнен на 50,000,000 кредитов',
      user: updatedUser
    });

  } catch (error) {
    console.error('Ошибка пополнения баланса:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
