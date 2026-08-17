from fastapi import APIRouter, Depends

from src.db import get_db
from src.models import user as user_model
from src.schemas import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
def list_users(conn=Depends(get_db)):
    return user_model.list_users(conn)
