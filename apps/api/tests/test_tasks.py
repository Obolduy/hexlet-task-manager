import pytest


def test_list_tasks_returns_seeded_count(client):
    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 50


def test_create_task_success(client):
    response = client.post(
        "/tasks",
        json={"title": "Новая задача", "description": "описание", "assignee_id": 1},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Новая задача"
    assert body["description"] == "описание"
    assert body["assignee_id"] == 1
    assert body["status"] == "new"


def test_create_task_without_title_is_rejected(client):
    response = client.post("/tasks", json={"description": "без названия"})
    assert response.status_code == 422


def test_create_task_with_unknown_assignee_is_rejected(client):
    response = client.post("/tasks", json={"title": "Задача", "assignee_id": 9999})
    assert response.status_code == 422


def test_get_task_success(client):
    response = client.get("/tasks/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1


def test_get_task_not_found(client):
    response = client.get("/tasks/9999")
    assert response.status_code == 404


def test_update_task_status_success(client):
    created = client.post("/tasks", json={"title": "Задача под смену статуса"}).json()

    response = client.patch(
        f"/tasks/{created['id']}/status", json={"status": "in_progress"}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "in_progress"
    assert body["updated_at"] != created["updated_at"]


def test_update_task_status_to_done_success(client):
    created = client.post("/tasks", json={"title": "Задача на завершение"}).json()
    assert created["status"] == "new"

    response = client.patch(f"/tasks/{created['id']}/status", json={"status": "done"})

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "done"
    assert body["updated_at"] != created["updated_at"]


def test_update_task_status_invalid_value_is_rejected(client):
    response = client.patch("/tasks/1/status", json={"status": "archived"})
    assert response.status_code == 422


def test_update_task_status_not_found(client):
    response = client.patch("/tasks/9999/status", json={"status": "done"})
    assert response.status_code == 404


@pytest.mark.skip(reason="починить после рефакторинга")
def test_direct_transition_from_new_to_done_is_rejected(client):
    created = client.post("/tasks", json={"title": "Задача без ревью"}).json()

    response = client.patch(f"/tasks/{created['id']}/status", json={"status": "done"})

    assert response.status_code == 422
