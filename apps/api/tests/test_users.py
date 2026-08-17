def test_list_users_returns_seeded_count(client):
    response = client.get("/users")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 5
    assert set(body[0].keys()) == {"id", "name", "email"}
