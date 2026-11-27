# NestJS Project

Backend-приложение на NestJS с двумя базами данных: PostgreSQL (TypeORM) для структурированных данных и MongoDB (Mongoose) для журнала действий.

## Технологии

- **Framework**: NestJS 12
- **Базы данных**: PostgreSQL 16 (TypeORM), MongoDB 7 (Mongoose)
- **Аутентификация**: JWT (passport-jwt, bcryptjs)
- **Валидация**: class-validator, class-transformer
- **API документация**: Swagger
- **Тесты**: Vitest
- **Линтинг**: oxlint, Prettier
- **Контейнеризация**: Docker, Docker Compose

## Структура проекта

```
src/
├── auth/              # Аутентификация и авторизация (JWT, guards, strategies)
├── tasks/             # Задачи (PostgreSQL)
├── users/             # Пользователи (PostgreSQL)
├── logs/              # Журнал действий (MongoDB)
├── migrations/        # Миграции TypeORM
├── app.module.ts      # Корневой модуль
└── main.ts            # Точка входа
```

## Быстрый запуск через Docker Compose

### 1. Клонирование и настройка

```bash
git clone <repository-url>
cd nest-project
cp .env.example .env.docker
```

Отредактируйте `.env.docker` при необходимости.

### 2. Запуск

```bash
docker-compose up --build
```

Приложение доступно на `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api`

### 3. Остановка

```bash
docker-compose down
docker-compose down -v    
```

## Локальный запуск (без Docker)

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск баз данных

```bash
docker run -d -p 5433:5432 --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb postgres:16-alpine

docker run -d -p 27017:27017 --name mongo mongo:7
```

### 3. Переменные окружения (.env)

```env
DATABASE_URL=postgresql://postgres:secret@localhost:5433/mydb
MONGODB_URI=mongodb://localhost:27017/nest_logs

JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Запуск приложения

```bash
npm run start:dev
```

## API

### Auth
- `POST /auth/register` — регистрация
- `POST /auth/login` — вход (возвращает JWT)
- `GET /auth/profile` — профиль текущего пользователя

### Users (PostgreSQL)
- `GET /users` — список пользователей
- `POST /users` — создать пользователя
- `GET /users/:id` — получить пользователя
- `PATCH /users/:id` — обновить
- `DELETE /users/:id` — удалить

### Tasks (PostgreSQL)
- `GET /tasks` — список задач
- `POST /tasks` — создать задачу
- `GET /tasks/:id` — получить задачу
- `PATCH /tasks/:id` — обновить
- `DELETE /tasks/:id` — удалить

### Logs (MongoDB)
- `GET /logs` — список логов
- `POST /logs` — создать лог
- `GET /logs/:id` — получить лог
- `PATCH /logs/:id` — обновить
- `DELETE /logs/:id` — удалить
- `GET /logs/stats` — статистика (агрегация `$match` + `$group` + `$sort`)

## Почему MongoDB для модуля логов

Проект использует **polyglot persistence** — разные базы данных для разных типов данных:

| Критерий | PostgreSQL (users, tasks) | MongoDB (logs) |
|----------|---------------------------|----------------|
| Структура | Жёсткая схема, связи | Гибкая, поле `meta` |
| Операции | CRUD + JOIN | Вставка + чтение |
| Нагрузка | Сбалансированная | Write-heavy |
| Связи | Внешние ключи | Мягкие ссылки (`userId`) |

**Преимущества MongoDB для логов:**

1. **Гибкая структура** — поле `meta` хранит разные данные для разных событий без изменения схемы.
2. **Write-heavy нагрузка** — MongoDB оптимизирована под быструю вставку.
3. **Нет JOIN-запросов** — связь с `users` через `userId` (мягкая ссылка).
4. **Агрегации** — встроенный pipeline для статистики (`$match`, `$group`, `$sort`).
5. **Масштабирование** — шардинг и TTL-индексы для авто-очистки старых записей.

## Скрипты

```bash
npm run start:dev    # разработка с hot-reload
npm run build        # сборка
npm run start:prod   # продакшен
npm run test         # тесты
npm run test:watch   # тесты в режиме watch
npm run test:cov     # покрытие кода
npm run lint         # линтинг
npm run format       # форматирование
```

## Тесты

```bash
npm run test         # unit-тесты
npm run test:e2e     # e2e-тесты
npm run test:cov     # отчёт о покрытии
```

## Docker

```dockerfile
# Multi-stage build: builder → production
# Образ на базе node:20-alpine (~150 MB)
```

```yaml
# docker-compose.yml: postgres + mongo + app
# Сеть между контейнерами, volumes для данных
```

См. `Dockerfile` и `docker-compose.yml` в корне проекта
