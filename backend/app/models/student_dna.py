from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class StudentDNA(Base):
    __tablename__ = "student_dna"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Profile Metadata
    profile_completion = Column(Integer, default=0)
    
    # Learning Preferences
    preferred_learning_style = Column(String, nullable=True)
    available_study_hours = Column(Integer, nullable=True)
    preferred_difficulty = Column(String, nullable=True)
    preferred_content_format = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="student_dna")
