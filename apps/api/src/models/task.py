import sqlite3
from datetime import datetime, timezone
from typing import Optional


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def list_tasks(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute("select * from tasks order by id").fetchall()
    return [dict(row) for row in rows]


def create_task(
    conn: sqlite3.Connection,
    title: str,
    description: Optional[str],
    assignee_id: Optional[int],
) -> dict:
    now = _now()
    cursor = conn.execute(
        """
        insert into tasks (title, description, status, assignee_id, created_at, updated_at)
        values (?, ?, 'new', ?, ?, ?)
        """,
        (title, description, assignee_id, now, now),
    )
    conn.commit()
    return get_task(conn, cursor.lastrowid)


def get_task(conn: sqlite3.Connection, task_id: int) -> Optional[dict]:
    row = conn.execute("select * from tasks where id = ?", (task_id,)).fetchone()
    return dict(row) if row else None


def update_task_status(conn: sqlite3.Connection, task_id: int, status: str) -> Optional[dict]:
    now = _now()
    conn.execute(
        "update tasks set status = ?, updated_at = ? where id = ?",
        (status, now, task_id),
    )
    conn.commit()
    return get_task(conn, task_id)
