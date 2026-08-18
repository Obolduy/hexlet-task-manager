# hexlet-task-manager
Хекслет таск менеджер

## Запуск

```bash
docker compose up --build
```

- Фронтенд: http://localhost:8080
- API: http://localhost:8000

Данные хранятся в volume и переживают `docker compose down`. Чтобы стереть их
вместе с контейнерами: `docker compose down -v`.
