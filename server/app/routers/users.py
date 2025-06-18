from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import User as UserSchema
from app.auth import get_current_active_user

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Get current user profile.
    """
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user by ID (for future use if needed).
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 