import os
import io
import shutil
import pytest
from fastapi.testclient import TestClient
from app.services.storage_service import STORAGE_DIR

@pytest.fixture(autouse=True)
def clean_storage():
    """Ensure storage directory is clean before and after tests."""
    if os.path.exists(STORAGE_DIR):
        shutil.rmtree(STORAGE_DIR)
    os.makedirs(STORAGE_DIR, exist_ok=True)
    yield
    if os.path.exists(STORAGE_DIR):
        shutil.rmtree(STORAGE_DIR)

def test_unauthenticated_upload(client):
    response = client.post("/api/learning-hub/documents/upload", files={"file": ("test.pdf", b"%PDF-1.4", "application/pdf")})
    assert response.status_code == 401

def test_upload_valid_pdf(client, auth_token):
    res = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("test.pdf", b"%PDF-1.4...", "application/pdf")}
    )
    assert res.status_code == 201
    doc = res.json()
    assert doc["title"] == "test"
    assert doc["file_name"] == "test.pdf"
    assert doc["mime_type"] == "application/pdf"
    assert doc["file_size"] > 0
    assert doc["status"] == "pending"
    assert doc["source_type"] == "file"
    assert "file_path" not in doc

    # Verify physical file
    user_id = doc["user_id"]
    user_dir = os.path.join(STORAGE_DIR, str(user_id))
    assert os.path.exists(user_dir)
    files = os.listdir(user_dir)
    assert len(files) == 1
    assert files[0] != "test.pdf" # Must be uuid

def test_upload_valid_txt(client, auth_token):
    res = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("notes.txt", b"Hello world", "text/plain")}
    )
    assert res.status_code == 201
    assert res.json()["file_name"] == "notes.txt"
    assert res.json()["mime_type"] == "text/plain"

def test_upload_unsupported_extension(client, auth_token):
    res = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("malware.exe", b"MZ...", "application/x-msdownload")}
    )
    assert res.status_code == 422
    assert "Unsupported file extension" in res.json()["detail"]

def test_upload_oversized_file(client, auth_token):
    # Mocking large file upload is tricky, let's create a dummy file just slightly over limit
    # Actually, we can just send a lot of bytes, or we can mock file size check.
    # To avoid 20MB payload in memory, we can use a small payload and monkeypatch MAX_FILE_SIZE
    import app.services.storage_service as ss
    original_max = ss.MAX_FILE_SIZE
    ss.MAX_FILE_SIZE = 10  # 10 bytes limit
    
    try:
        res = client.post(
            "/api/learning-hub/documents/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            files={"file": ("test.pdf", b"12345678901", "application/pdf")}
        )
        assert res.status_code == 422
        assert "File too large" in res.json()["detail"]
    finally:
        ss.MAX_FILE_SIZE = original_max

def test_user_isolation(client):
    # Setup user A
    client.post("/api/auth/signup", json={"email": "ingesta@example.com", "password": "pass", "name": "A"})
    token_a = client.post("/api/auth/login", json={"email": "ingesta@example.com", "password": "pass"}).json()["access_token"]
    
    # Setup user B
    client.post("/api/auth/signup", json={"email": "ingestb@example.com", "password": "pass", "name": "B"})
    token_b = client.post("/api/auth/login", json={"email": "ingestb@example.com", "password": "pass"}).json()["access_token"]

    # User A uploads doc
    res_a = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {token_a}"},
        files={"file": ("private.pdf", b"...", "application/pdf")}
    )
    doc_id = res_a.json()["id"]

    # User B tries to retrieve
    res_get = client.get(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_get.status_code == 404

    # User B tries to delete
    res_del = client.delete(f"/api/learning-hub/documents/{doc_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_del.status_code == 404

def test_owner_delete_cleans_file(client, auth_token):
    # Upload
    res_up = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("delete_me.pdf", b"...", "application/pdf")}
    )
    doc = res_up.json()
    user_id = doc["user_id"]
    
    user_dir = os.path.join(STORAGE_DIR, str(user_id))
    assert len(os.listdir(user_dir)) == 1
    
    # Delete
    res_del = client.delete(f"/api/learning-hub/documents/{doc['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_del.status_code == 204
    
    # Verify file is gone
    assert len(os.listdir(user_dir)) == 0

def test_delete_missing_file_safe(client, auth_token):
    # Upload
    res_up = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("delete_me2.pdf", b"...", "application/pdf")}
    )
    doc = res_up.json()
    user_id = doc["user_id"]
    
    # Manually delete physical file
    user_dir = os.path.join(STORAGE_DIR, str(user_id))
    for f in os.listdir(user_dir):
        os.remove(os.path.join(user_dir, f))
        
    # API Delete should still succeed and not 500
    res_del = client.delete(f"/api/learning-hub/documents/{doc['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    assert res_del.status_code == 204

def test_path_traversal_filename(client, auth_token):
    # Even if they somehow submit a filename with traversal, our code UUIDizes it.
    res = client.post(
        "/api/learning-hub/documents/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("../../../windows/system32/cmd.pdf", b"...", "application/pdf")}
    )
    assert res.status_code == 201
    doc = res.json()
    assert doc["file_name"] == "../../../windows/system32/cmd.pdf"
    
    # But physical file should be safe inside our storage dir
    user_dir = os.path.join(STORAGE_DIR, str(doc["user_id"]))
    files = os.listdir(user_dir)
    assert len(files) == 1
    assert ".." not in files[0]

def test_is_safe_path_logic():
    from app.services.storage_service import is_safe_path
    base = os.path.join(STORAGE_DIR, "1")
    
    # Inside base
    assert is_safe_path(base, os.path.join(base, "file.pdf")) == True
    
    # Prefix collision / sibling directory
    assert is_safe_path(base, os.path.join(STORAGE_DIR, "10", "file.pdf")) == False
    
    # Traversal out
    assert is_safe_path(base, os.path.join(base, "..", "file.pdf")) == False

def test_upload_db_failure_cleans_up_file(client, auth_token):
    # Monkeypatch the DB commit to simulate a failure
    import app.services.learning_hub_service as lhs
    from unittest.mock import patch
    
    with patch("sqlalchemy.orm.Session.commit", side_effect=Exception("Simulated DB error")):
        res = client.post(
            "/api/learning-hub/documents/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            files={"file": ("db_fail.pdf", b"...", "application/pdf")}
        )
        assert res.status_code == 500
        assert "Failed to save document record" in res.json()["detail"]
        
        # Verify that the physical file was cleaned up (storage dir should be empty or not contain the new file)
        # Since we don't know the exact user_id, let's just check the whole storage dir for any files
        # Actually user_id is embedded in the token, but we can just walk the tree
        found_files = []
        for root, dirs, files in os.walk(STORAGE_DIR):
            for f in files:
                found_files.append(f)
        assert len(found_files) == 0
