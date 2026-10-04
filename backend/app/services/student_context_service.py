from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import Profile
from app.models.education import Education
from app.models.skill import Skill
from app.models.goal import Goal
from app.models.interest import Interest
from app.models.student_dna import StudentDNA

def build_student_context(db: Session, user: User) -> dict:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    education = db.query(Education).filter(Education.user_id == user.id).first()
    skills = db.query(Skill).filter(Skill.user_id == user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    interests = db.query(Interest).filter(Interest.user_id == user.id).all()
    dna = db.query(StudentDNA).filter(StudentDNA.user_id == user.id).first()

    context = {
        "profile": {},
        "education": {},
        "skills": [s.skill_name for s in skills],
        "interests": [i.name for i in interests],
        "goals": [],
        "student_dna": {}
    }

    if profile and profile.name:
        context["profile"]["name"] = profile.name

    if education:
        context["education"] = {
            "level": education.education_level,
            "institution": education.institution,
            "course": education.course,
            "branch": education.branch,
        }

    for goal in goals:
        context["goals"].append({
            "career_goal": goal.career_goal,
            "target_role": goal.target_role,
            "target_industry": goal.target_industry
        })

    if dna:
        context["student_dna"] = {
            "learning_style": dna.preferred_learning_style,
            "available_study_hours": dna.available_study_hours,
            "difficulty": dna.preferred_difficulty,
            "content_format": dna.preferred_content_format
        }

    return context
