# Learnix Backend

This is the backend API for Learnix, a personalized Student Learning & Career OS.
Phase 1 focuses on building a solid foundation with user management, profiles, education, skills, and goals.

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
