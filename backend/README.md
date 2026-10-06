# Learnix Backend

This is the backend API for Learnix, a personalized Student Learning & Career OS.
Phase 1 focuses on building a solid foundation with user management, profiles, education, skills, and goals.
Phase 2 focuses on Student DNA and calculating profile completion.
Phase 3 focuses on aggregating data for the Personalized Dashboard.
Phase 4 focuses on the AI Mentor foundation.

## Tech Stack
- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT authentication

## Setup Instructions

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Variables:**
    Copy `.env.example` to `.env` and update the values.
    ```bash
    cp .env.example .env
    ```

4.  **Run the application:**
    ```bash
    uvicorn app.main:app --reload
    ```

5.  **View Documentation:**
    -   Swagger UI: http://localhost:8000/docs
    -   ReDoc: http://localhost:8000/redoc

## Testing

Run tests with `pytest`:
```bash
pytest
```

## Database Migrations
Currently, the project uses `Base.metadata.create_all` on startup. For Phase 5.2.1, a minimal schema migration is executed automatically in the FastAPI lifespan to add the `file_size` column to the `documents` table safely (`ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size INTEGER;`). For local Supabase instances, this will execute transparently upon server boot.
