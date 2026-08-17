from fastapi import APIRouter, Depends, HTTPException

from src.db import get_db
from src.schemas import TaskCreate, TaskOut, TaskStatusUpdate
from src.services import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
def list_tasks(conn=Depends(get_db)):
    return task_service.list_tasks(conn)


@router.post("", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate, conn=Depends(get_db)):
    try:
        return task_service.create_task(
            conn, payload.title, payload.description, payload.assignee_id
        )
    except task_service.AssigneeNotFound:
        raise HTTPException(
            status_code=422, detail="assignee_id does not reference an existing user"
        )


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, conn=Depends(get_db)):
    try:
        return task_service.get_task(conn, task_id)
    except task_service.TaskNotFound:
        raise HTTPException(status_code=404, detail="task not found")


@router.patch("/{task_id}/status", response_model=TaskOut)
def update_task_status(task_id: int, payload: TaskStatusUpdate, conn=Depends(get_db)):
    try:
        return task_service.set_status(conn, task_id, payload.status.value)
    except task_service.TaskNotFound:
        raise HTTPException(status_code=404, detail="task not found")
