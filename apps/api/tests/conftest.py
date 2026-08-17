import pytest
from fastapi.testclient import TestClient

from src import db as db_module
from src.main import app
from src.seed import seed_if_empty


@pytest.fixture()
def client(tmp_path):
    db_path = tmp_path / "test.db"

    conn = db_module.get_connection(db_path)
    db_module.init_db(conn)
    seed_if_empty(conn)
    conn.close()

    def override_get_db():
        conn = db_module.get_connection(db_path)
        try:
            yield conn
        finally:
            conn.close()

    # Не входим в TestClient как в контекстный менеджер: это запустило бы
    # lifespan приложения, а он открывает соединение по умолчанному
    # DB_PATH — реальному файлу app.db, а не изолированной тестовой БД.
    app.dependency_overrides[db_module.get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()
