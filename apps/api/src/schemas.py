from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"


class TaskCreate(BaseModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None
    assignee_id: Optional[int] = None


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    assignee_id: Optional[int]
    created_at: str
    updated_at: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
