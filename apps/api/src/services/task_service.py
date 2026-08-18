import sqlite3
from typing import Optional

from src.models import task as task_model
from src.models import user as user_model


class TaskNotFound(Exception):
    pass


class AssigneeNotFound(Exception):
    pass


def list_tasks(conn: sqlite3.Connection) -> list[dict]:
    return task_model.list_tasks(conn)


def create_task(
    conn: sqlite3.Connection,
    title: str,
    description: Optional[str],
    assignee_id: Optional[int],
) -> dict:
    if assignee_id is not None and user_model.get_user(conn, assignee_id) is None:
        raise AssigneeNotFound(assignee_id)
    return task_model.create_task(conn, title, description, assignee_id)


def get_task(conn: sqlite3.Connection, task_id: int) -> dict:
    print('task_model.get_task(conn, task_id)')
    task = task_model.get_task(conn, task_id)
    if task is None:
        raise TaskNotFound(task_id)
    return task


def set_status(conn: sqlite3.Connection, task_id: int, status: str) -> dict:
    if task_model.get_task(conn, task_id) is None:
        raise TaskNotFound(task_id)
    return task_model.update_task_status(conn, task_id, status)
