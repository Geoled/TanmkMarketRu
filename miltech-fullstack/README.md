# 🛡️ MilTech - Платформа военной техники

![MilTech Banner](/public/og-image.png)

**MilTech** — это полнофункциональная платформа для покупки и продажи военной техники, запчастей и оборудования. Современный стек технологий, темная тема в военном стиле и полная интеграция с Supabase.

## 📸 Скриншоты

### Главная страница
![Главная страница](https://via.placeholder.com/1200x675/0f1419/d97706?text=MilTech+Homepage)

### Страница объявления
![Страница объявления](https://via.placeholder.com/1200x675/1a2332/d97706?text=Listing+Details+Page)

### Форма создания
![Форма создания](https://via.placeholder.com/1200x675/0f1419/d97706?text=Create+Listing+Form)

### Профиль пользователя
![Профиль](https://via.placeholder.com/1200x675/1a2332/d97706?text=User+Profile)

## 🚀 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend** | Next.js 14 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **Backend** | Next.js Server Actions, API Routes |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Maps** | Leaflet |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## 📋 Функционал

- ✅ **Каталог техники** с фильтрацией по категориям
- ✅ **Детальная страница** с характеристиками, картой и описанием
- ✅ **Создание объявлений** с динамическими полями
- ✅ **Система покупок** с фейковой экономикой
- ✅ **Профиль пользователя** со статистикой и историей транзакций
- ✅ **Темная тема** в военном стиле
- ✅ **Адаптивный дизайн** (mobile-first)
- ✅ **SEO оптимизация** (мета-теги, sitemap, robots.txt)
- ✅ **Кастомные страницы ошибок** (404, 500)

## 🏃 Локальный запуск

### Требования
- Node.js 20+
- npm или pnpm
- Аккаунт на Supabase

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/yourusername/miltech-fullstack.git
cd miltech-fullstack

# Установка зависимостей
npm install

# Копирование переменных окружения
cp .env.example .env

# Редактирование .env (добавьте ваши ключи Supabase)
# См. раздел "Настройка базы данных" ниже

# Генерация Prisma Client
npx prisma generate

# Применение миграций (если база уже создана)
npx prisma migrate deploy

# Сидирование тестовыми данными (опционально)
npm run prisma:seed

# Запуск development сервера
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Настройка базы данных

1. Создайте проект на [Supabase](https://supabase.com)
2. Получите переменные окружения (см. [DEPLOY.md](./DEPLOY.md))
3. Обновите файл `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"
```

## 📁 Структура проекта

```
miltech-fullstack/
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   └── seed.ts                # Сидирование тестовыми данными
├── src/
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── listing/[id]/      # Страница деталей объявления
│   │   ├── create/            # Форма создания объявления
│   │   ├── profile/           # Профиль пользователя
│   │   ├── actions/           # Server Actions
│   │   ├── error.tsx          # Страница 500
│   │   ├── not-found.tsx      # Страница 404
│   │   ├── loading.tsx        # Глобальный loading
│   │   ├── layout.tsx         # Root layout с SEO
│   │   ├── page.tsx           # Главная страница
│   │   ├── sitemap.ts         # Sitemap
│   │   └── robots.ts          # Robots.txt
│   ├── components/
│   │   ├── Header.tsx         # Шапка сайта
│   │   ├── Footer.tsx         # Подвал сайта
│   │   ├── ListingCard.tsx    # Карточка объявления
│   │   ├── ListingMap.tsx     # Карта Leaflet
│   │   ├── AttributesTable.tsx # Таблица характеристик
│   │   ├── BuyButton.tsx      # Кнопка покупки
│   │   ├── DynamicAttributes.tsx # Динамические поля формы
│   │   ├── ImageUpload.tsx    # Загрузка изображений
│   │   ├── ProfileStats.tsx   # Статистика профиля
│   │   ├── TransactionList.tsx # Список транзакций
│   │   └── FadeIn.tsx         # Анимация появления
│   ├── lib/
│   │   ├── prisma.ts          # Prisma клиент
│   │   └── supabase/          # Supabase клиенты
│   └── utils/
│       └── supabase/          # Supabase утилиты
├── public/                    # Статические файлы
├── .env.example              # Пример переменных окружения
├── DEPLOY.md                 # Руководство по деплою
├── next.config.ts            # Next.js конфигурация
├── package.json              # Зависимости и скрипты
├── tailwind.config.ts        # Tailwind конфигурация
└── tsconfig.json             # TypeScript конфигурация
```

## 🔌 API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/api/listings` | Получить список всех объявлений |
| `GET` | `/api/listings/[id]` | Получить объявление по ID |
| `POST` | `/api/listings` | Создать новое объявление |
| `PUT` | `/api/listings/[id]` | Обновить объявление |
| `DELETE` | `/api/listings/[id]` | Удалить объявление |
| `POST` | `/api/transactions` | Совершить покупку |
| `GET` | `/api/users/[id]` | Получить данные пользователя |
| `POST` | `/api/users/[id]/topup` | Пополнить баланс (тест) |

## 🗺️ Roadmap

### v1.0 (Текущая версия)
- ✅ Базовый CRUD объявлений
- ✅ Система покупок
- ✅ Профиль пользователя

### v1.1 (В разработке)
- [ ] Реальная аутентификация (Supabase Auth)
- [ ] Загрузка изображений в Supabase Storage
- [ ] Поиск и фильтрация объявлений
- [ ] Комментарии и рейтинги

### v1.2 (Планируется)
- [ ] Уведомления (email, push)
- [ ] Избранное
- [ ] Чат между покупателем и продавцом
- [ ] Модерация объявлений

### v2.0 (Будущее)
- [ ] Мультиязычность (i18n)
- [ ] PWA поддержка
- [ ] Telegram бот
- [ ] API для мобильных приложений

## 🤝 Вклад

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл для деталей.

## 👥 Команда

- **Разработка** - MilTech Team
- **Дизайн** - MilTech Team
- **Бэкенд** - MilTech Team

## 📞 Контакты

- Email: support@miltech.com
- GitHub: [@miltech](https://github.com/miltech)

---

**🛡️ Защищено военным шифрованием | © 2025 MilTech**
