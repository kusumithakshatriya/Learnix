from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.auth_service import get_current_active_user
from app.services import dashboard_service

router = APIRouter()

@router.get("", response_model=DashboardResponse)
def get_dashboard_endpoint(
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    """Retrieve the personalized dashboard for the current user."""
    return dashboard_service.get_dashboard_data(db, current_user)
