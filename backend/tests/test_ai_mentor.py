from fastapi.testclient import TestClient

def test_ai_mentor_unauthenticated(client):
    response = client.post("/api/ai-mentor/chat", json={"message": "Hello", "mode": "teacher"})
    assert response.status_code == 401

def test_ai_mentor_empty_message(client, auth_token):
    response = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"message": "", "mode": "teacher"}
    )
    assert response.status_code == 422 # Validation error for empty message

def test_ai_mentor_invalid_mode(client, auth_token):
    response = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"message": "Hello", "mode": "invalid_mode"}
    )
    assert response.status_code == 422

def test_ai_mentor_new_conversation(client, auth_token):
    response = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"message": "How do I learn Python?", "mode": "teacher"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert data["mode"] == "teacher"
    assert data["message"]["role"] == "assistant"
    assert "AI Mentor development response" in data["message"]["content"]
    assert "teacher" in data["message"]["content"]

    # Check context
    assert "context" in data
    assert "profile" in data["context"]
    assert "skills" in data["context"]
    assert "goals" in data["context"]

    # Save conversation ID for next test
    # Assertions successful

def test_ai_mentor_existing_conversation(client, auth_token):
    # First create a conversation
    res1 = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"message": "First message", "mode": "career_mentor"}
    )
    conv_id = res1.json()["conversation_id"]

    # Then append to it
    res2 = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"message": "Second message", "mode": "career_mentor", "conversation_id": conv_id}
    )
    assert res2.status_code == 200
    assert res2.json()["conversation_id"] == conv_id

def test_ai_mentor_user_isolation(client):
    # Setup user A
    client.post(
        "/api/auth/signup",
        json={"email": "aia@example.com", "password": "password", "name": "AI User A"}
    )
    token_a = client.post("/api/auth/login", json={"email": "aia@example.com", "password": "password"}).json()["access_token"]

    # Setup user B
    client.post(
        "/api/auth/signup",
        json={"email": "aib@example.com", "password": "password", "name": "AI User B"}
    )
    token_b = client.post("/api/auth/login", json={"email": "aib@example.com", "password": "password"}).json()["access_token"]

    # User A creates a conversation
    res_a = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"message": "I am user A", "mode": "study_coach"}
    )
    conv_id = res_a.json()["conversation_id"]

    # User B tries to append to User A's conversation
    res_b = client.post(
        "/api/ai-mentor/chat",
        headers={"Authorization": f"Bearer {token_b}"},
        json={"message": "I am user B hijacking", "mode": "study_coach", "conversation_id": conv_id}
    )
    assert res_b.status_code == 404
