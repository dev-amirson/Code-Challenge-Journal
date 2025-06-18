from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""


class UserCreate(UserBase):
    password: str
    password_confirm: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: str
    is_active: bool
    created_at: datetime


class UserResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer"


class JournalEntryBase(BaseModel):
    title: str
    content: str


class JournalEntryCreate(JournalEntryBase):
    pass


class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class JournalEntry(JournalEntryBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    mood: Optional[str] = None
    mood_score: Optional[float] = None
    top_emotions: List[str] = []
    summary: Optional[str] = None
    analysis_completed: bool = False


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
    errors: List[str] = []


class JournalEntryFilter(BaseModel):
    mood: Optional[str] = None
    min_mood_score: Optional[float] = None
    max_mood_score: Optional[float] = None
    limit: int = 20
    offset: int = 0 