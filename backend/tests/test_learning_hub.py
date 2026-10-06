from fastapi.testclient import TestClient

def test_unauthenticated_access(client):
    response = client.get("/api/learning-hub/documents")
    assert response.status_code == 401

def test_create_and_list_document(client, auth_token):
    # Create
    res_create = client.post(
        "/api/learning-hub/documents",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"title": "Test Doc", "source_type": "text", "extracted_text": "Hello world"}
    )
    assert res_create.status_code == 201
    doc = res_create.json()
    assert doc["title"] == "Test Doc"
    assert doc["source_type"] == "text"
    assert doc["status"] == "pending"
    doc_id = doc["id"]

    # List
    res_list = client.get("/api/learning-hub/documents", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_list.status_code == 200
    docs = res_list.json()
    assert len(docs) >= 1
    assert any(d["id"] == doc_id for d in docs)

def test_retrieve_and_delete_document(client, auth_token):
    res_create = client.post(
        "/api/learning-hub/documents",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"title": "To Delete", "source_type": "url", "source_url": "https://example.com"}
    )
    doc_id = res_create.json()["id"]

    # Retrieve
    res_get = client.get(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_get.status_code == 200
    assert res_get.json()["title"] == "To Delete"

    # Delete
    res_del = client.delete(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_del.status_code == 204

    # Verify deleted
    res_get_after = client.get(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_get_after.status_code == 404

def test_user_isolation(client):
    # User A
    client.post("/api/auth/signup", json={"email": "huba@example.com", "password": "password", "name": "Hub A"})
    token_a = client.post("/api/auth/login", json={"email": "huba@example.com", "password": "password"}).json()["access_token"]
    
    # User B
    client.post("/api/auth/signup", json={"email": "hubb@example.com", "password": "password", "name": "Hub B"})
    token_b = client.post("/api/auth/login", json={"email": "hubb@example.com", "password": "password"}).json()["access_token"]

    # User A creates doc
    res_a = client.post(
        "/api/learning-hub/documents",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"title": "Private A", "source_type": "text"}
    )
    doc_id = res_a.json()["id"]

    # User B tries to retrieve
    res_get = client.get(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_get.status_code == 404

    # User B tries to delete
    res_del = client.delete(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_del.status_code == 404

def test_invalid_source_type(client, auth_token):
    res = client.post(
        "/api/learning-hub/documents",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"title": "Invalid", "source_type": "unknown_type"}
    )
    assert res.status_code == 422
