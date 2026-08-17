import sqlite3
from typing import Optional


def list_users(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute("select * from users order by id").fetchall()
    return [dict(row) for row in rows]


def get_user(conn: sqlite3.Connection, user_id: int) -> Optional[dict]:
    row = conn.execute("select * from users where id = ?", (user_id,)).fetchone()
    return dict(row) if row else None
