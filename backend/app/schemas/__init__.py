from app.schemas.auth import Token, UserLogin, UserSignup, UserResponse
from app.schemas.profile import ProfileUpdate, ProfileResponse, ProfileBase
from app.schemas.education import EducationCreate, EducationResponse
from app.schemas.skill import SkillCreate, SkillResponse
from app.schemas.goal import GoalCreate, GoalResponse
from app.schemas.interest import InterestCreate, InterestResponse
from app.schemas.student_dna import StudentDNAUpdate, StudentDNAResponse, LearningPreferences
from app.schemas.dashboard import DashboardResponse
from app.schemas.ai_mentor import ChatRequest, ChatResponse, MentorMode, AIMessageSchema
from app.schemas.document import DocumentCreate, DocumentResponse, SourceType, DocumentStatus
from app.schemas.summary import SummaryResponse
from app.schemas.note import NoteResponse
from app.schemas.flashcard import FlashcardResponse
