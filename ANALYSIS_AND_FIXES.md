# MilTech Fullstack - Анализ и решение проблем

## Выявленные проблемы в репозитории

### 1. **Отсутствие подключения фронтенда к бэкенду**
- Статический HTML (`/workspace/index.html`) использовал жестко закодированные данные из `js/data.js`
- Next.js приложение (`/workspace/miltech-fullstack/`) имело API роуты, но не было интеграции с отдельным фронтендом
- Отсутствовал механизм загрузки данных с сервера

### 2. **Проблемы конфигурации**
- Отсутствовал файл `.env` для переменных окружения
- Prisma клиент не был сгенерирован
- Не было указано подключение к базе данных

### 3. **Архитектурные проблемы**
- Два независимых проекта в одном репозитории:
  - Статический сайт (HTML/JS)
  - Next.js полное приложение
- Дублирование функциональности (каталог техники)
- Нет единой точки входа

## Выполненные исправления

### 1. Создан API эндпоинт для получения списка объявлений
**Файл:** `/workspace/miltech-fullstack/src/app/api/listings/route.ts`

API поддерживает следующие параметры фильтрации:
- `category` - категория техники (tank, aircraft, naval, demilitarized)
- `search` - поиск по названию и описанию
- `minPrice`, `maxPrice` - диапазон цен
- `has3D`, `hasBlueprint` - фильтры по наличию 3D модели и чертежей
- `sort` - сортировка (newest, price_asc, price_desc, weight)

### 2. Обновлен статический фронтенд для работы с API
**Файлы:** 
- `/workspace/index.html` - добавлена конфигурация API_BASE_URL
- `/workspace/js/app.js` - добавлена функция `fetchListingsFromAPI()`

Теперь фронтенд:
1. Пытается загрузить данные с бэкенда через `/api/listings`
2. При недоступности бэкенда использует локальные данные как fallback
3. Поддерживает все фильтры и сортировку через API параметры

### 3. Настроена среда разработки
**Файл:** `/workspace/miltech-fullstack/.env`

Создан шаблон файла окружения с:
- DATABASE_URL для PostgreSQL
- Переменными Supabase для аутентификации

### 4. Установлены зависимости и сгенерирован Prisma Client
```bash
npm install
npx prisma generate
```

## Как запустить проект

### Вариант A: Запуск Next.js приложения (рекомендуется)

```bash
cd /workspace/miltech-fullstack

# 1. Настройте базу данных
# Отредактируйте .env и укажите ваш DATABASE_URL

# 2. Примените миграции (если есть)
npx prisma migrate deploy

# 3. Заполните тестовыми данными (опционально)
npm run prisma:seed

# 4. Запустите dev сервер
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

### Вариант B: Запуск статического фронтенда с подключением к API

1. Сначала запустите Next.js сервер (см. выше)
2. Откройте `/workspace/index.html` в браузере или через локальный сервер:
   ```bash
   cd /workspace
   python3 -m http.server 8080
   ```
3. Откройте `http://localhost:8080`

Фронтенд автоматически подключится к API на `http://localhost:3000/api`

## Структура API

### GET /api/listings
Возвращает список всех объявлений с поддержкой фильтрации.

**Параметры query:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| category | string | Категория: tank, aircraft, naval, parts, demilitarized |
| search | string | Поисковый запрос |
| minPrice | number | Минимальная цена |
| maxPrice | number | Максимальная цена |
| has3D | boolean | Только с 3D моделью |
| hasBlueprint | boolean | Только с чертежами |
| sort | string | Сортировка: newest, price_asc, price_desc, weight |

**Ответ:**
```json
[
  {
    "id": "uuid",
    "title": "Т-72Б3 (Демилитаризованный)",
    "category": "tank",
    "categoryLabel": "Основной боевой танк",
    "price": 8500000,
    "location": "Самара",
    "coordinates": [53.2001, 50.1500],
    "status": "active",
    "statusLabel": "Боеготовая",
    "year": 1985,
    "combatWeight": 44.5,
    "country": "Россия/СССР",
    "image": "https://...",
    "attributes": {...},
    "description": "...",
    "has3D": true,
    "hasBlueprint": true,
    "compatible": [...]
  }
]
```

### GET /api/listings/[id]
Возвращает детальную информацию об объявлении.

### POST /api/transactions
Создает транзакцию покупки.

**Тело запроса:**
```json
{
  "listingId": "uuid",
  "buyerId": "uuid"
}
```

## Рекомендации по улучшению

1. **Консолидация проектов**: Объединить статический фронтенд и Next.js в единое приложение
2. **Аутентификация**: Настроить Supabase Auth для пользователей
3. **База данных**: Развернуть PostgreSQL (Supabase или локально)
4. **Миграции**: Создать и применить Prisma миграции
5. **CORS**: Настроить CORS если фронтенд и бэкенд на разных доменах
