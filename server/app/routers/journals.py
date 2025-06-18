from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from app.database import get_db
from app.models import User, JournalEntry
from app.schemas import (
    JournalEntry as JournalEntrySchema,
    JournalEntryCreate,
    JournalEntryUpdate,
    ApiResponse
)
from app.auth import get_current_active_user
from app.services import mood_analysis_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


async def analyze_entry_background(entry_id: int, title: str, content: str, db: Session):
    """
    Background task to analyze journal entry mood.
    """
    try:
        analysis = await mood_analysis_service.analyze_journal_entry(title, content)
        
        entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
        if entry:
            entry.mood = analysis['mood']
            entry.mood_score = analysis['mood_score']
            entry.top_emotions = analysis['top_emotions']
            entry.summary = analysis['summary']
            entry.analysis_completed = True
            db.commit()
            logger.info(f"Completed mood analysis for entry {entry_id}")
    except Exception as e:
        logger.error(f"Failed to analyze entry {entry_id}: {e}")


@router.post("/", response_model=JournalEntrySchema)
async def create_journal_entry(
    entry_data: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new journal entry with automatic mood analysis.
    """
    try:
        db_entry = JournalEntry(
            user_id=current_user.id,
            title=entry_data.title,
            content=entry_data.content
        )
        
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        
        try:
            analysis = await mood_analysis_service.analyze_journal_entry(
                entry_data.title, 
                entry_data.content
            )
            
            db_entry.mood = analysis['mood']
            db_entry.mood_score = analysis['mood_score']
            db_entry.top_emotions = analysis['top_emotions']
            db_entry.summary = analysis['summary']
            db_entry.analysis_completed = True
            db.commit()
            db.refresh(db_entry)
            
            logger.info(f"Completed mood analysis for entry {db_entry.id}")
            
        except Exception as analysis_error:
            logger.error(f"Failed to analyze entry {db_entry.id}: {analysis_error}")
            pass
        
        return db_entry
        
    except Exception as e:
        logger.error(f"Error creating journal entry: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create journal entry"
        )


@router.get("/", response_model=List[JournalEntrySchema])
async def get_journal_entries(
    mood: Optional[str] = Query(None, description="Filter by mood"),
    min_mood_score: Optional[float] = Query(None, description="Minimum mood score"),
    max_mood_score: Optional[float] = Query(None, description="Maximum mood score"),
    limit: int = Query(20, le=100, description="Maximum number of entries to return"),
    offset: int = Query(0, ge=0, description="Number of entries to skip"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get journal entries for the current user with optional filtering.
    """
    try:
        query = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id)
        
        if mood:
            query = query.filter(JournalEntry.mood.ilike(f"%{mood}%"))
        
        if min_mood_score is not None:
            query = query.filter(JournalEntry.mood_score >= min_mood_score)
            
        if max_mood_score is not None:
            query = query.filter(JournalEntry.mood_score <= max_mood_score)
        
        entries = query.order_by(desc(JournalEntry.created_at)).offset(offset).limit(limit).all()
        
        return entries
        
    except Exception as e:
        logger.error(f"Error fetching journal entries: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch journal entries"
        )


@router.get("/{entry_id}", response_model=JournalEntrySchema)
async def get_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific journal entry by ID.
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    return entry


@router.put("/{entry_id}", response_model=JournalEntrySchema)
async def update_journal_entry(
    entry_id: int,
    entry_data: JournalEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a journal entry. Re-analyzes mood if title or content is changed.
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    try:
        title_or_content_changed = False
        if entry_data.title is not None:
            entry.title = entry_data.title
            title_or_content_changed = True
        if entry_data.content is not None:
            entry.content = entry_data.content
            title_or_content_changed = True
        
        db.commit()
        db.refresh(entry)
        
        if title_or_content_changed:
            entry.mood = None
            entry.mood_score = None
            entry.top_emotions = []
            entry.summary = None
            entry.analysis_completed = False
            db.commit()
            
            try:
                analysis = await mood_analysis_service.analyze_journal_entry(
                    entry.title,
                    entry.content
                )
                
                entry.mood = analysis['mood']
                entry.mood_score = analysis['mood_score']
                entry.top_emotions = analysis['top_emotions']
                entry.summary = analysis['summary']
                entry.analysis_completed = True
                db.commit()
                db.refresh(entry)
                
                logger.info(f"Completed mood analysis for updated entry {entry.id}")
                
            except Exception as analysis_error:
                logger.error(f"Failed to analyze updated entry {entry.id}: {analysis_error}")
                pass
        
        return entry
        
    except Exception as e:
        logger.error(f"Error updating journal entry: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update journal entry"
        )


@router.delete("/{entry_id}")
async def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a journal entry.
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    try:
        db.delete(entry)
        db.commit()
        
        return {"message": "Journal entry deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting journal entry: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete journal entry"
        ) 