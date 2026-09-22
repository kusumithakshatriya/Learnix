from fastapi.testclient import TestClient
from app.main import app

def test_get_student_dna_unauthenticated(client):
    response = client.get("/api/student-dna")
    assert response.status_code == 401

def test_get_student_dna_authenticated(client, auth_token):
    response = client.get("/api/student-dna", headers={"Authorization": f"Bearer {auth_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "profile_completion" in data
    assert data["profile_completion"] >= 0
    assert "learning_preferences" in data

def test_update_student_dna(client, auth_token):
    response = client.put(
        "/api/student-dna",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "learning_preferences": {
                "preferred_learning_style": "Visual",
                "available_study_hours": 10,
                "preferred_difficulty": "Medium",
                "preferred_content_format": "Video"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["learning_preferences"]["preferred_learning_style"] == "Visual"
    assert data["learning_preferences"]["available_study_hours"] == 10

def test_add_and_list_interests(client, auth_token):
    response = client.post(
        "/api/interests",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Machine Learning", "category": "Tech"}
    )
    assert response.status_code == 201
    interest = response.json()
    assert interest["name"] == "Machine Learning"
    
    # List interests
    res2 = client.get("/api/interests", headers={"Authorization": f"Bearer {auth_token}"})
    assert res2.status_code == 200
    interests = res2.json()
    assert len(interests) >= 1
    assert interests[0]["name"] == "Machine Learning"
    
    # Delete interest
    res3 = client.delete(f"/api/interests/{interest['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res3.status_code == 204

def test_profile_completion_calculation(client, auth_token):
    # It should be 30% by default because Profile with name was created during signup (20%) 
    # and previous test updated learning preferences (10%)
    res1 = client.get("/api/student-dna", headers={"Authorization": f"Bearer {auth_token}"})
    assert res1.json()["profile_completion"] == 30
    
    # Add a skill
    client.post(
        "/api/skills",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"skill_name": "Python", "skill_level": 80}
    )
    
    # Check again (should add 20%)
    res2 = client.get("/api/student-dna", headers={"Authorization": f"Bearer {auth_token}"})
    assert res2.json()["profile_completion"] == 50

def test_cannot_delete_other_user_interest(client, auth_token):
    # Setup user 2
    client.post(
        "/api/auth/signup",
        json={"email": "other@example.com", "password": "password123", "name": "Other User"}
    )
    res = client.post("/api/auth/login", json={"email": "other@example.com", "password": "password123"})
    other_token = res.json()["access_token"]
    
    # Add interest for user 1
    interest_res = client.post(
        "/api/interests",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"name": "Hacking"}
    )
    interest_id = interest_res.json()["id"]
    
    # User 2 tries to delete User 1's interest
    del_res = client.delete(f"/api/interests/{interest_id}", headers={"Authorization": f"Bearer {other_token}"})
    assert del_res.status_code == 404
