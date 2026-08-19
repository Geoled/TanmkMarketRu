# 📦 Руководство по деплою MilTech на Vercel

## Шаг 1: Подготовка базы данных на Supabase

### 1.1 Создание проекта
1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **Start your project** → **Sign Up** (можно через GitHub)
3. Создайте новый проект:
   - **Name**: `miltech`
   - **Database Password**: придумайте надежный пароль (**сохраните его!**)
   - **Region**: выберите ближайший (например, Frankfurt для России)
4. Нажмите **Create new project** и подождите 2-3 минуты

### 1.2 Получение переменных окружения
После создания проекта:

1. **DATABASE_URL**:
   - Settings (шестеренка слева) → Database
   - Прокрутите до раздела **Connection string**
   - Выберите **URI** и скопируйте строку подключения
   - Формат: `postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true`

2. **Supabase API ключи**:
   - Settings → API
   - Скопируйте **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Скопируйте **anon public** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Скопируйте **service_role** (секретный!) → `SUPABASE_SERVICE_ROLE_KEY`

## Шаг 2: Настройка переменных окружения в Vercel

### 2.1 Подключение репозитория к Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **Add New Project**
3. Импортируйте ваш GitHub репозиторий `miltech-fullstack`
4. Нажмите **Import**

### 2.2 Добавление переменных окружения
В настройках проекта на Vercel (Settings → Environment Variables) добавьте:

```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**⚠️ Важно**: Добавьте переменные для всех сред (Production, Preview, Development)

## Шаг 3: Применение схемы базы данных

### 3.1 Локальная генерация Prisma Client
Перед деплоем убедитесь, что Prisma Client сгенерирован:

```bash
npm run postinstall
# или
npx prisma generate
```

### 3.2 Применение миграций на Production
После первого деплоя выполните команду для применения схемы:

```bash
# Через Vercel CLI
vercel env pull production
npx prisma migrate deploy
```

Или используйте **Vercel Deploy Hooks**:

1. В Vercel: Settings → Git → Deploy Hooks → Create Hook
2. Назовите hook `prisma-migrate`
3. Используйте GitHub Actions для автоматической миграции:

```yaml
# .github/workflows/prisma-migrate.yml
name: Prisma Migrate

on:
  deployment_status:
    states: [success]

jobs:
  migrate:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.environment === 'Production'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Шаг 4: Сидирование данных (опционально)

Для заполнения базы данных тестовыми данными:

```bash
# Локально
npm run prisma:seed

# На production (через Vercel CLI)
vercel env pull production
npm run prisma:seed
```

**⚠️ Внимание**: Seed удалит существующие данные! Используйте только для начальной настройки.

## 🔍 Troubleshooting частых ошибок

### Ошибка: "Prisma Client is not generated"
**Решение**: Убедитесь, что скрипт `postinstall` выполняется:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Ошибка: "Database URL is not valid"
**Решение**: Проверьте формат DATABASE_URL:
- Должен содержать `?pgbouncer=true` для Supabase
- Пароль должен быть правильно закодирован (специальные символы)

### Ошибка: "Module '@prisma/client' not found"
**Решение**: 
```bash
npm install @prisma/client
npx prisma generate
```

### Ошибка: "Build failed because of webpack errors"
**Решение**: Проверьте логи сборки в Vercel Dashboard. Частые причины:
- Отсутствуют переменные окружения
- Ошибки TypeScript
- Неправильные импорты

### Ошибка: "Function invocation failed"
**Решение**: Проверьте Server Actions и API routes:
- Убедитесь, что все ENV переменные настроены
- Проверьте логи в Vercel Functions

### Карта Leaflet не работает
**Решение**: Убедитесь, что CSS Leaflet загружается:
```tsx
import 'leaflet/dist/leaflet.css';
```

### Изображения не загружаются
**Решение**: Проверьте `next.config.ts`:
- Добавьте домены в `images.remotePatterns`
- Убедитесь, что URL изображений доступны публично

## ✅ Чеклист перед деплоем

- [ ] Все переменные окружения настроены в Vercel
- [ ] База данных создана на Supabase
- [ ] Миграции применены (`prisma migrate deploy`)
- [ ] Seed выполнен (опционально)
- [ ] Локально всё работает (`npm run dev`)
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок TypeScript (`npm run build`)
- [ ] Изображения загружаются (проверьте remotePatterns)
- [ ] Карта работает (проверьте CSS Leaflet)
- [ ] Форма создания объявлений работает
- [ ] Покупка техники работает
- [ ] Страница профиля отображается
- [ ] 404 и 500 страницы кастомизированы
- [ ] SEO мета-теги настроены
- [ ] Favicon добавлен

## 📊 Мониторинг после деплоя

1. **Vercel Analytics**: Включите в настройках проекта
2. **Vercel Logs**: Проверяйте вкладки Functions и Build
3. **Supabase Logs**: Settings → Logs
4. **Error Tracking**: Рассмотрите Sentry или LogRocket

## 🔐 Безопасность

- Никогда не коммитьте `.env` файлы в репозиторий
- Используйте `.env.example` для документации переменных
- Регулярно обновляйте зависимости (`npm audit`)
- Включите защиту веток в GitHub
- Используйте Secrets для чувствительных данных

## 📈 Оптимизация производительности

1. Включите **Edge Caching** в Vercel
2. Используйте **Incremental Static Regeneration (ISR)** для страниц листингов
3. Оптимизируйте изображения через `next/image`
4. Минимизируйте размер бандла (анализ через `@next/bundle-analyzer`)

---

**Поддержка**: При возникновении проблем создайте issue в репозитории или обратитесь к документации:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
