import pytest


def test_list_tasks_returns_seeded_count(client):
    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 50


def test_list_tasks_filtered_by_status_returns_only_matching(client):
    response = client.get("/tasks", params={"status": "done"})

    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert all(task["status"] == "done" for task in body)


def test_list_tasks_filtered_by_assignee_returns_only_matching(client):
    all_tasks = client.get("/tasks").json()
    assignee_id = next(task["assignee_id"] for task in all_tasks if task["assignee_id"] is not None)

    response = client.get("/tasks", params={"assignee_id": assignee_id})

    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert all(task["assignee_id"] == assignee_id for task in body)


def test_list_tasks_filtered_by_status_and_assignee_combined(client):
    all_tasks = client.get("/tasks").json()
    assignee_id = next(task["assignee_id"] for task in all_tasks if task["assignee_id"] is not None)
    expected = {
        task["id"]
        for task in all_tasks
        if task["assignee_id"] == assignee_id and task["status"] == "new"
    }

    response = client.get("/tasks", params={"assignee_id": assignee_id, "status": "new"})

    assert response.status_code == 200
    body = response.json()
    assert {task["id"] for task in body} == expected


def test_list_tasks_filtered_by_invalid_status_is_rejected(client):
    response = client.get("/tasks", params={"status": "archived"})
    assert response.status_code == 422


def test_list_tasks_filtered_by_unknown_assignee_returns_empty_list(client):
    response = client.get("/tasks", params={"assignee_id": 9999})

    assert response.status_code == 200
    assert response.json() == []


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
