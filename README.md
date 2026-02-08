# Todo MERN

Полнофункциональное приложение для управления задачами на базе MongoDB, Express, React и Node.js (MERN stack).

## Технологии

**Бэкенд:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Zod, Swagger

**Фронтенд:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Query, React Hook Form, Framer Motion

## Структура проекта

```
todo-mern/
├── src/                    # Бэкенд (Express)
│   ├── config/             # Конфигурация (БД, env, swagger)
│   ├── controllers/        # Обработчики запросов
│   ├── middlewares/         # Аутентификация, валидация, обработка ошибок
│   ├── models/             # Mongoose-схемы (User, Todo, Token)
│   ├── repositories/       # Слой доступа к данным
│   ├── routes/             # Маршруты API
│   ├── services/           # Бизнес-логика
│   ├── utils/              # Вспомогательные функции
│   ├── app.ts              # Настройка Express-приложения
│   └── server.ts           # Точка входа сервера
├── client/                 # Фронтенд (React + Vite)
│   ├── src/
│   │   ├── components/     # UI-компоненты
│   │   ├── hooks/          # Пользовательские хуки
│   │   ├── lib/            # Axios, утилиты
│   │   ├── pages/          # Страницы
│   │   ├── services/       # API-сервисы
│   │   ├── stores/         # Хранилища состояния (Zustand)
│   │   └── types/          # TypeScript-типы
│   └── ...
└── ...
```

## Возможности

- Регистрация и авторизация пользователей (JWT access + refresh токены)
- Создание, чтение, обновление и удаление задач (CRUD)
- Уровни приоритета (низкий, средний, высокий)
- Сроки выполнения и теги
- Фильтрация и поиск
- Документация API через Swagger (`/api/docs`)
- Адаптивный дизайн (Tailwind CSS)
- Тёмная и светлая тема

## Установка

### Требования

- Node.js >= 18
- MongoDB (локальный или Atlas)

### 1. Клонировать репозиторий

```bash
git clone https://github.com/your-username/todo-mern.git
cd todo-mern
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Измените JWT-секреты в файле `.env`:

```env
JWT_ACCESS_SECRET=ваш-секретный-access-ключ-минимум-32-символа
JWT_REFRESH_SECRET=ваш-секретный-refresh-ключ-минимум-32-символа
```

### 3. Установить зависимости

```bash
# Бэкенд
npm install

# Фронтенд
cd client
npm install
```

### 4. Запустить приложение

```bash
# Бэкенд (из корневой папки)
npm run dev

# Фронтенд (из папки client/)
cd client
npm run dev
```

Бэкенд запускается на `http://localhost:5000`, фронтенд на `http://localhost:3000`.

## Конечные точки API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/health` | Проверка работоспособности |
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Обновление токена |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/todos` | Получить задачи (фильтрация, сортировка) |
| POST | `/api/todos` | Создать задачу |
| GET | `/api/todos/:id` | Получить задачу по ID |
| PATCH | `/api/todos/:id` | Обновить задачу |
| DELETE | `/api/todos/:id` | Удалить задачу |

Полная документация API: `http://localhost:5000/api/docs`

## Скрипты

**Бэкенд:**

```bash
npm run dev        # Сервер для разработки (hot reload)
npm run build      # Компиляция TypeScript
npm start          # Продакшен-сервер
npm run lint       # Проверка кода
npm run format     # Форматирование кода
```

**Фронтенд:**

```bash
npm run dev        # Сервер для разработки
npm run build      # Сборка для продакшена
npm run preview    # Предпросмотр сборки
npm run lint       # Проверка кода
```

## Лицензия

MIT
