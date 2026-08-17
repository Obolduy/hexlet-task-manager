import random
import sqlite3
from datetime import datetime, timedelta, timezone

from src.db import is_empty

USERS = [
    ("Алина Петрова", "alina.petrova@example.com"),
    ("Дмитрий Соколов", "dmitry.sokolov@example.com"),
    ("Мария Кузнецова", "maria.kuznecova@example.com"),
    ("Игорь Волков", "igor.volkov@example.com"),
    ("Светлана Орлова", "svetlana.orlova@example.com"),
]

# Неравномерное распределение по статусам — нужно для будущей фильтрации.
STATUS_WEIGHTS = [
    ("new", 20),
    ("in_progress", 15),
    ("in_review", 8),
    ("done", 7),
]

TASK_COUNT = 50
UNASSIGNED_COUNT = 8
SEED_RANDOM_SEED = 42


def _statuses_for_seed() -> list[str]:
    statuses: list[str] = []
    for status, count in STATUS_WEIGHTS:
        statuses.extend([status] * count)
    return statuses


def seed_if_empty(conn: sqlite3.Connection) -> None:
    if not is_empty(conn):
        return

    user_ids = []
    for name, email in USERS:
        cursor = conn.execute(
            "insert into users (name, email) values (?, ?)", (name, email)
        )
        user_ids.append(cursor.lastrowid)

    rng = random.Random(SEED_RANDOM_SEED)
    statuses = _statuses_for_seed()
    rng.shuffle(statuses)
    unassigned_indexes = set(rng.sample(range(TASK_COUNT), UNASSIGNED_COUNT))

    now = datetime.now(timezone.utc)
    for i in range(TASK_COUNT):
        assignee_id = None if i in unassigned_indexes else rng.choice(user_ids)
        created_at = (now - timedelta(days=TASK_COUNT - i)).isoformat()
        conn.execute(
            """
            insert into tasks (title, description, status, assignee_id, created_at, updated_at)
            values (?, ?, ?, ?, ?, ?)
            """,
            (
                f"Задача {i + 1}",
                f"Автосгенерированное описание задачи {i + 1}",
                statuses[i],
                assignee_id,
                created_at,
                created_at,
            ),
        )

    conn.commit()
