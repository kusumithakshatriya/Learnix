from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.core.config import settings
from app.database.base import Base
from app.database.connection import engine

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables for Phase 1 (In production, use Alembic migrations)
    Base.metadata.create_all(bind=engine)

    # Minimal schema migration for Phase 5.2.1
    from sqlalchemy import text
    with engine.begin() as conn:
        if engine.dialect.name == "postgresql":
            conn.execute(text("ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size INTEGER;"))
        elif engine.dialect.name == "sqlite":
            try:
                conn.execute(text("ALTER TABLE documents ADD COLUMN file_size INTEGER;"))
            except Exception:
                pass

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME.split()[0]
    }

app.include_router(api_router, prefix=settings.API_V1_STR)
