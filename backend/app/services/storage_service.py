import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException, status
from typing import Tuple

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "storage")
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain"
}

def get_user_storage_path(user_id: int) -> str:
    path = os.path.join(STORAGE_DIR, str(user_id))
    os.makedirs(path, exist_ok=True)
    return path

def is_safe_path(base_dir: str, target_path: str) -> bool:
    # Resolve absolute paths and check if target is strictly inside base
    abs_base = os.path.abspath(base_dir)
    abs_target = os.path.abspath(target_path)
    try:
        common = os.path.commonpath([abs_base, abs_target])
        return common == abs_base
    except ValueError:
        # Paths are on different drives on Windows
        return False

def validate_and_save_upload(user_id: int, file: UploadFile) -> Tuple[str, int]:
    # Validate extension
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")
        
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Unsupported file extension: {ext}")
        
    # Validate mime type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Unsupported mime type: {file.content_type}")

    # Validate size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="File too large (max 20MB)")
        
    # Generate secure filename
    secure_filename = f"{uuid.uuid4()}{ext}"
    user_dir = get_user_storage_path(user_id)
    file_path = os.path.join(user_dir, secure_filename)
    
    # Path traversal check
    if not is_safe_path(user_dir, file_path):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid path")
        
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save file")
        
    return file_path, file_size

def delete_stored_file(file_path: str) -> bool:
    if not file_path:
        return False
    try:
        if os.path.exists(file_path):
            # Ensure it is inside our storage dir to prevent arbitrary deletion
            abs_storage = os.path.abspath(STORAGE_DIR)
            abs_target = os.path.abspath(file_path)
            try:
                common = os.path.commonpath([abs_storage, abs_target])
                if common == abs_storage:
                    os.remove(file_path)
                    return True
            except ValueError:
                pass
    except Exception:
        pass # Handle missing or locked physical files safely
    return False
