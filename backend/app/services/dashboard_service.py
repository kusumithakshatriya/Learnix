from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import Profile
from app.models.education import Education
from app.models.skill import Skill
from app.models.goal import Goal
from app.models.interest import Interest
from app.models.student_dna import StudentDNA
from app.services.student_dna_service import calculate_profile_completion

def get_dashboard_data(db: Session, user: User) -> dict:
    # 1. Load basic related models
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    education_records = db.query(Education).filter(Education.user_id == user.id).all()
    skills = db.query(Skill).filter(Skill.user_id == user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    interests = db.query(Interest).filter(Interest.user_id == user.id).all()
    dna = db.query(StudentDNA).filter(StudentDNA.user_id == user.id).first()
    
    # Calculate profile completion dynamically using existing service
    profile_completion = calculate_profile_completion(db, user.id)

    # 2. Build User Summary
    user_name = profile.name if profile and profile.name else None

    # 3. Choose primary Education and Goal (first one found)
    primary_education = education_records[0] if education_records else None
    primary_goal = goals[0] if goals else None

    # 4. Generate Highlights & Missing Information
    strengths = [skill.skill_name for skill in skills]
    
    focus_areas = []
    if primary_goal and primary_goal.career_goal:
        focus_areas.append(primary_goal.career_goal)
        
    missing_info = []
    if not skills:
        missing_info.append("skills")
    if not interests:
        missing_info.append("interests")
    if not goals:
        missing_info.append("career goal")
        
    dna_incomplete = False
    if not dna or not dna.preferred_learning_style:
        missing_info.append("learning style")
        dna_incomplete = True
    if not dna or not dna.available_study_hours:
        missing_info.append("available study hours")
        dna_incomplete = True
    if not dna or not dna.preferred_difficulty:
        missing_info.append("preferred difficulty")
        dna_incomplete = True
    if not dna or not dna.preferred_content_format:
        missing_info.append("preferred content format")
        dna_incomplete = True

    # 5. Generate Quick Actions
    quick_actions = []
    if dna_incomplete:
        quick_actions.append({
            "key": "complete_student_dna",
            "title": "Complete Student DNA",
            "reason": "Complete your learning preferences"
        })
    if not skills:
        quick_actions.append({
            "key": "add_skills",
            "title": "Add your skills",
            "reason": "Add your current skills to personalize Learnix"
        })
    if not interests:
        quick_actions.append({
            "key": "add_interests",
            "title": "Add your interests",
            "reason": "Tell Learnix what you are interested in"
        })
    if not goals:
        quick_actions.append({
            "key": "set_goal",
            "title": "Set a career goal",
            "reason": "Choose a target role or career direction"
        })

    # 6. Build the response structure
    return {
        "user": {
            "name": user_name,
            "email": user.email
        },
        "profile_completion": profile_completion,
        "education": primary_education,
        "career_goal": primary_goal,
        "skills": skills,
        "interests": interests,
        "highlights": {
            "strengths": strengths,
            "focus_areas": focus_areas,
            "missing_information": missing_info
        },
        "quick_actions": quick_actions,
        "meta": {
            "generated_at": datetime.now(timezone.utc),
            "version": "1"
        }
    }
