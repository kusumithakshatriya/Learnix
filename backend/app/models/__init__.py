from app.models.user import User
from app.models.profile import Profile
from app.models.education import Education
from app.models.skill import Skill
from app.models.goal import Goal
from app.models.student_dna import StudentDNA
from app.models.interest import Interest
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.models.document import Document
from app.models.summary import Summary
from app.models.note import Note
from app.models.flashcard import Flashcard

__all__ = [
    "User", "Profile", "Education", "Skill", "Goal", "StudentDNA", "Interest", 
    "AIConversation", "AIMessage", "Document", "Summary", "Note", "Flashcard"
]
