from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.student_dna import StudentDNA
from app.models.interest import Interest
from app.models.profile import Profile
from app.models.education import Education
from app.models.skill import Skill
from app.models.goal import Goal
from app.schemas.student_dna import StudentDNAUpdate, LearningPreferences, StudentDNAResponse
from app.schemas.interest import InterestCreate

def get_or_create_student_dna(db: Session, user_id: int) -> StudentDNA:
    dna = db.query(StudentDNA).filter(StudentDNA.user_id == user_id).first()
    if not dna:
        dna = StudentDNA(user_id=user_id)
        db.add(dna)
        db.commit()
        db.refresh(dna)
    return dna

def calculate_profile_completion(db: Session, user_id: int) -> int:
    completion = 0
    
    # Check Profile (20%)
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile and profile.name:
        completion += 20
        
    # Check Education (20%)
    education_count = db.query(Education).filter(Education.user_id == user_id).count()
    if education_count > 0:
        completion += 20
        
    # Check Skills (20%)
    skill_count = db.query(Skill).filter(Skill.user_id == user_id).count()
    if skill_count > 0:
        completion += 20
        
    # Check Goals (20%)
    goal_count = db.query(Goal).filter(Goal.user_id == user_id).count()
    if goal_count > 0:
        completion += 20
        
    # Check Interests (10%)
    interest_count = db.query(Interest).filter(Interest.user_id == user_id).count()
    if interest_count > 0:
        completion += 10
        
    # Check Learning Preferences in DNA (10%)
    dna = db.query(StudentDNA).filter(StudentDNA.user_id == user_id).first()
    if dna and (dna.preferred_learning_style or dna.available_study_hours or dna.preferred_difficulty or dna.preferred_content_format):
        completion += 10
        
    # Update DNA record
    if dna:
        dna.profile_completion = completion
        db.commit()
        
    return completion

def get_student_dna(db: Session, user: User) -> dict:
    dna = get_or_create_student_dna(db, user.id)
    
    # Recalculate on fetch
    calculate_profile_completion(db, user.id)
    
    # Refresh to get updated completion
    db.refresh(dna)
    
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    education = db.query(Education).filter(Education.user_id == user.id).all()
    skills = db.query(Skill).filter(Skill.user_id == user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    interests = db.query(Interest).filter(Interest.user_id == user.id).all()
    
    return {
        "user_id": user.id,
        "profile": profile,
        "education": education,
        "skills": skills,
        "goals": goals,
        "interests": interests,
        "learning_preferences": {
            "preferred_learning_style": dna.preferred_learning_style,
            "available_study_hours": dna.available_study_hours,
            "preferred_difficulty": dna.preferred_difficulty,
            "preferred_content_format": dna.preferred_content_format
        },
        "profile_completion": dna.profile_completion,
        "created_at": dna.created_at,
        "updated_at": dna.updated_at
    }

def update_student_dna(db: Session, user_id: int, data: StudentDNAUpdate) -> dict:
    dna = get_or_create_student_dna(db, user_id)
    
    if data.learning_preferences:
        lp = data.learning_preferences
        if lp.preferred_learning_style is not None:
            dna.preferred_learning_style = lp.preferred_learning_style
        if lp.available_study_hours is not None:
            dna.available_study_hours = lp.available_study_hours
        if lp.preferred_difficulty is not None:
            dna.preferred_difficulty = lp.preferred_difficulty
        if lp.preferred_content_format is not None:
            dna.preferred_content_format = lp.preferred_content_format
            
    db.commit()
    
    # Fetch user model to pass back to get_student_dna
    user = db.query(User).filter(User.id == user_id).first()
    return get_student_dna(db, user)

def get_interests(db: Session, user_id: int):
    return db.query(Interest).filter(Interest.user_id == user_id).all()

def add_interest(db: Session, user_id: int, data: InterestCreate):
    new_interest = Interest(user_id=user_id, **data.model_dump())
    db.add(new_interest)
    db.commit()
    db.refresh(new_interest)
    
    # Recalculate profile completion
    calculate_profile_completion(db, user_id)
    
    return new_interest

def delete_interest(db: Session, user_id: int, interest_id: int):
    interest = db.query(Interest).filter(Interest.id == interest_id, Interest.user_id == user_id).first()
    if not interest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interest not found")
        
    db.delete(interest)
    db.commit()
    
    # Recalculate profile completion
    calculate_profile_completion(db, user_id)
    
    return {"message": "Interest deleted successfully"}
