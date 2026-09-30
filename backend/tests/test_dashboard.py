from fastapi.testclient import TestClient

def test_dashboard_unauthenticated(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 401

def test_dashboard_authenticated_and_structure(client, auth_token):
    # Retrieve Dashboard
    res = client.get("/api/dashboard", headers={"Authorization": f"Bearer {auth_token}"})
    assert res.status_code == 200
    
    data = res.json()
    assert "user" in data
    assert "profile_completion" in data
    assert "education" in data
    assert "career_goal" in data
    assert "skills" in data
    assert "interests" in data
    assert "highlights" in data
    assert "quick_actions" in data
    assert "meta" in data

    # Verify User information
    assert data["user"]["email"] == "dna@example.com"
    assert data["user"]["name"] == "DNA User"

def test_dashboard_quick_actions_and_missing_info(client, auth_token):
    res = client.get("/api/dashboard", headers={"Authorization": f"Bearer {auth_token}"})
    data = res.json()
    
    # We haven't added goals or education yet for this token in this test file
    # Check that missing info contains 'career goal'
    assert "career goal" in data["highlights"]["missing_information"]
    
    # Check quick actions
    keys = [action["key"] for action in data["quick_actions"]]
    assert "set_goal" in keys

def test_dashboard_with_data(client, auth_token):
    # Add a Goal
    client.post(
        "/api/goals",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"career_goal": "Software Engineer"}
    )
    
    # Add an Education
    client.post(
        "/api/education",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"education_level": "Undergraduate", "institution": "Tech Uni"}
    )

    res = client.get("/api/dashboard", headers={"Authorization": f"Bearer {auth_token}"})
    data = res.json()

    assert data["career_goal"]["career_goal"] == "Software Engineer"
    assert data["education"]["institution"] == "Tech Uni"
    
    # Missing info should no longer contain 'career goal'
    assert "career goal" not in data["highlights"]["missing_information"]
    keys = [action["key"] for action in data["quick_actions"]]
    assert "set_goal" not in keys

def test_user_separation(client):
    # Create user A
    client.post(
        "/api/auth/signup",
        json={"email": "usera@example.com", "password": "password", "name": "User A"}
    )
    token_a = client.post("/api/auth/login", json={"email": "usera@example.com", "password": "password"}).json()["access_token"]
    
    # Create user B
    client.post(
        "/api/auth/signup",
        json={"email": "userb@example.com", "password": "password", "name": "User B"}
    )
    token_b = client.post("/api/auth/login", json={"email": "userb@example.com", "password": "password"}).json()["access_token"]
    
    # Add goal for A
    client.post("/api/goals", headers={"Authorization": f"Bearer {token_a}"}, json={"career_goal": "Goal A"})
    
    # Check B's dashboard
    res_b = client.get("/api/dashboard", headers={"Authorization": f"Bearer {token_b}"})
    data_b = res_b.json()
    assert data_b["user"]["name"] == "User B"
    assert data_b["career_goal"] is None
