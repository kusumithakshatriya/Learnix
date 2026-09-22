from fastapi import APIRouter
from app.api import auth, profile, education, skills, goals, student_dna, interests

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(education.router, prefix="/education", tags=["education"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(student_dna.router, prefix="/student-dna", tags=["student-dna"])
api_router.include_router(interests.router, prefix="/interests", tags=["interests"])
