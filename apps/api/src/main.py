from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.db import get_connection, init_db
from src.routes import tasks, users
from src.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    conn = get_connection()
    init_db(conn)
    seed_if_empty(conn)
    conn.close()
    yield


app = FastAPI(title="Task Manager API", lifespan=lifespan)
app.include_router(tasks.router)
app.include_router(users.router)
