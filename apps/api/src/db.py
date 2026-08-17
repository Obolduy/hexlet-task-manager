import sqlite3
from pathlib import Path
from typing import Iterator

DB_PATH = Path(__file__).resolve().parent.parent / "app.db"

SCHEMA = """
create table if not exists users (
    id     integer primary key autoincrement,
    name   text not null,
    email  text not null unique
);

create table if not exists tasks (
    id           integer primary key autoincrement,
    title        text not null,
    description  text,
    status       text not null default 'new',
    assignee_id  integer references users(id),
    created_at   text not null,
    updated_at   text not null
);
"""


def get_connection(db_path: Path | str = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("pragma foreign_keys = on")
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    conn.commit()


def is_empty(conn: sqlite3.Connection) -> bool:
    row = conn.execute("select count(*) as count from users").fetchone()
    return row["count"] == 0


def get_db() -> Iterator[sqlite3.Connection]:
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()
