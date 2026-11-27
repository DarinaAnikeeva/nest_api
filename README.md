
# NestJS Project

Backend-приложение на NestJS с PostgreSQL (TypeORM) и MongoDB (Mongoose).

## Технологии

- NestJS, TypeORM, Mongoose
- PostgreSQL, MongoDB
- JWT, class-validator, Swagger
- Docker

## Структура

```
src/
├── auth/          # Аутентификация
├── tasks/         # Задачи (PostgreSQL)
├── users/         # Пользователи (PostgreSQL)
├── logs/          # Логи (MongoDB)
├── app.module.ts
└── main.ts
```

## Установка и запуск

### 1. Зависимости
```bash
npm install
```

### 2. Переменные окружения (.env)
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_db

MONGODB_URI=mongodb://localhost:27017/nest_logs

JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
```

### 3. Запуск баз данных
```bash
docker run -d -p 5433:5432 --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nest_db postgres:15

docker run -d -p 27017:27017 --name mongo mongo:7
```

### 4. Запуск приложения
```bash
npm run start:dev
```

Swagger: `http://localhost:3000/api`

## API

### Auth
- `POST /auth/register` — регистрация
- `POST /auth/login` — вход
- `GET /auth/profile` — профиль

### Users (PostgreSQL)
- `GET /users`, `POST /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`

### Tasks (PostgreSQL)
- `GET /tasks`, `POST /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`

### Logs (MongoDB)
- `GET /logs`, `POST /logs`, `GET /logs/:id`, `PATCH /logs/:id`, `DELETE /logs/:id`
- `GET /logs/stats` — агрегация ($match + $group + $sort)

## Почему MongoDB для логов

1. **Гибкая структура** — поле `meta` хранит разные данные для разных событий, без жёсткой схемы.
2. **Write-heavy** — логи пишутся часто и читаются редко, MongoDB оптимизирована под вставку.
3. **Нет связей** — связь с `users` через `userId` (мягкая ссылка), join-запросы не нужны.
4. **Агрегации** — встроенный pipeline для статистики.
5. **Масштабирование** — шардинг и TTL-индексы для авто-очистки старых записей.


## Скрипты

```bash
npm run start:dev    
npm run build       
npm run test         
```