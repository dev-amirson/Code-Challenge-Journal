#!/usr/bin/env python3
"""
Seed script for the FastAPI Journal Backend.

This script creates sample users and journal entries with realistic data
including mood analysis results. Run this script to populate your development
database with test data.

Usage:
    python seed_data.py

Make sure your database is running and migrations are applied before running this.
"""

import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import User, JournalEntry, Base
from app.auth import get_password_hash
import random


def create_tables():
    """Create database tables if they don't exist."""
    Base.metadata.create_all(bind=engine)


def get_db_session() -> Session:
    """Get database session."""
    return SessionLocal()


# Sample user data
SAMPLE_USERS = [
    {
        "username": "alice_writer",
        "email": "alice@example.com",
        "password": "password123",
        "first_name": "Alice",
        "last_name": "Johnson"
    },
    {
        "username": "bob_dev",
        "email": "bob@example.com", 
        "password": "password123",
        "first_name": "Bob",
        "last_name": "Smith"
    },
    {
        "username": "carol_artist",
        "email": "carol@example.com",
        "password": "password123", 
        "first_name": "Carol",
        "last_name": "Williams"
    },
    {
        "username": "david_student",
        "email": "david@example.com",
        "password": "password123",
        "first_name": "David",
        "last_name": "Brown"
    },
    {
        "username": "emma_teacher",
        "email": "emma@example.com",
        "password": "password123",
        "first_name": "Emma",
        "last_name": "Davis"
    }
]

# Sample journal entries with realistic content and mood analysis
SAMPLE_JOURNAL_ENTRIES = [
    # Alice's entries (writer - creative and introspective)
    {
        "title": "Morning Pages",
        "content": "Started my day with coffee and watching the sunrise. There's something magical about those quiet morning moments before the world wakes up. I feel inspired to write today. The story I've been working on is finally taking shape, and I can see the characters coming alive on the page.",
        "mood": "Inspired",
        "mood_score": 8.2,
        "top_emotions": ["creativity", "peace", "inspiration", "contentment"],
        "summary": "A peaceful, creative morning that sparked inspiration for writing projects."
    },
    {
        "title": "Writer's Block",
        "content": "Ugh, today was frustrating. I sat at my computer for hours and couldn't write a single decent sentence. Everything felt forced and artificial. Sometimes I wonder if I'm cut out for this writing thing. Maybe I should just stick to my day job.",
        "mood": "Frustrated",
        "mood_score": 3.1,
        "top_emotions": ["frustration", "doubt", "disappointment", "anxiety"],
        "summary": "Struggling with creative blocks and self-doubt about writing abilities."
    },
    {
        "title": "Book Club Success",
        "content": "The book club meeting went amazingly well today! Everyone loved the novel we discussed, and we had such deep conversations about the themes. I felt so connected to this community of readers. It reminded me why I love literature so much.",
        "mood": "Joyful",
        "mood_score": 9.1,
        "top_emotions": ["joy", "connection", "fulfillment", "love"],
        "summary": "A wonderful book club meeting that reinforced love for literature and community."
    },
    
    # Bob's entries (developer - analytical and goal-oriented)
    {
        "title": "Code Review Day",
        "content": "Spent most of today doing code reviews for the team. Found some interesting bugs and helped junior developers improve their coding practices. I really enjoy mentoring others and seeing them grow. There's something satisfying about writing clean, efficient code.",
        "mood": "Satisfied",
        "mood_score": 7.8,
        "top_emotions": ["satisfaction", "pride", "helpfulness", "accomplishment"],
        "summary": "Productive day mentoring team members and improving code quality."
    },
    {
        "title": "Deployment Disaster",
        "content": "What a nightmare! The deployment went completely wrong and brought down the entire production system for 3 hours. I feel terrible about it. The team worked together to fix it, but I can't shake the feeling that I should have caught this earlier in testing.",
        "mood": "Stressed",
        "mood_score": 2.5,
        "top_emotions": ["stress", "guilt", "anxiety", "responsibility"],
        "summary": "A stressful production incident that caused significant downtime and feelings of responsibility."
    },
    {
        "title": "New Framework Learning",
        "content": "Started learning React Native today. It's fascinating how similar yet different it is from regular React. I love learning new technologies - it keeps the job exciting. Planning to build a small side project to practice.",
        "mood": "Excited",
        "mood_score": 8.5,
        "top_emotions": ["excitement", "curiosity", "motivation", "anticipation"],
        "summary": "Beginning to learn a new technology with enthusiasm for future projects."
    },
    
    # Carol's entries (artist - emotional and expressive)
    {
        "title": "Gallery Opening",
        "content": "My first solo art exhibition opened tonight! I was so nervous, but people seemed to really connect with my paintings. One person even bought three pieces! I feel like all those late nights in the studio were worth it. This is what I've been working toward.",
        "mood": "Triumphant", 
        "mood_score": 9.7,
        "top_emotions": ["triumph", "validation", "pride", "relief"],
        "summary": "A successful gallery opening that validated artistic efforts and brought recognition."
    },
    {
        "title": "Creative Drought",
        "content": "I haven't painted anything meaningful in weeks. Every canvas I start just looks wrong somehow. Maybe I'm pushing too hard, or maybe I've lost my touch. Sometimes I wonder if I'm just fooling myself about being an artist.",
        "mood": "Melancholy",
        "mood_score": 4.2,
        "top_emotions": ["sadness", "doubt", "frustration", "emptiness"],
        "summary": "Experiencing a creative block and questioning artistic abilities and identity."
    },
    {
        "title": "Nature Inspiration",
        "content": "Went hiking today and the way the light filtered through the trees was absolutely breathtaking. I took dozens of photos for painting references. Nature always reminds me why I became an artist - to capture these fleeting moments of beauty.",
        "mood": "Inspired",
        "mood_score": 8.9,
        "top_emotions": ["inspiration", "wonder", "beauty", "purpose"],
        "summary": "A nature walk that reignited artistic inspiration and sense of purpose."
    },
    
    # David's entries (student - stressed but optimistic)
    {
        "title": "Midterm Week",
        "content": "Three exams down, two to go. I'm exhausted but feeling pretty good about how they went. The computer science exam was harder than expected, but I think I managed. Coffee has become my best friend this week.",
        "mood": "Tired",
        "mood_score": 6.1,
        "top_emotions": ["fatigue", "determination", "hope", "stress"],
        "summary": "Making progress through challenging midterm exams with cautious optimism."
    },
    {
        "title": "Study Group Win",
        "content": "Our study group session for calculus was incredibly productive! We finally figured out those integration problems that have been stumping us for weeks. I love how collaborative learning works - we all brought different strengths to the table.",
        "mood": "Accomplished",
        "mood_score": 8.0,
        "top_emotions": ["accomplishment", "gratitude", "clarity", "teamwork"],
        "summary": "A successful collaborative study session that solved difficult academic challenges."
    },
    {
        "title": "Future Worries",
        "content": "Everyone keeps asking what I want to do after graduation, and honestly, I have no idea. The job market seems scary, and I feel like I don't know enough yet. What if I can't find a job? What if I chose the wrong major?",
        "mood": "Anxious",
        "mood_score": 3.8,
        "top_emotions": ["anxiety", "uncertainty", "fear", "pressure"],
        "summary": "Worrying about post-graduation plans and career prospects in an uncertain job market."
    },
    
    # Emma's entries (teacher - caring and reflective)
    {
        "title": "Breakthrough Moment",
        "content": "Today one of my struggling students finally 'got' fractions! You should have seen the light in her eyes when it clicked. These are the moments that remind me why I love teaching. Every small victory feels huge when you see a child overcome a challenge.",
        "mood": "Proud",
        "mood_score": 9.2,
        "top_emotions": ["pride", "joy", "fulfillment", "love"],
        "summary": "Experiencing the joy of helping a student overcome academic challenges and succeed."
    },
    {
        "title": "Parent Conference Stress",
        "content": "Parent conferences were today, and one meeting got really difficult. The parent was upset about their child's grades and basically blamed everything on me. I know I'm doing my best, but it's hard not to take it personally sometimes.",
        "mood": "Discouraged",
        "mood_score": 4.5,
        "top_emotions": ["discouragement", "hurt", "defensiveness", "frustration"],
        "summary": "A challenging parent conference that created stress and self-doubt about teaching effectiveness."
    },
    {
        "title": "Professional Development",
        "content": "Attended a workshop on integrating technology in the classroom today. Got so many great ideas! I'm excited to try some new interactive tools with my students. Learning new teaching methods always energizes me.",
        "mood": "Energized",
        "mood_score": 7.9,
        "top_emotions": ["energy", "excitement", "learning", "anticipation"],
        "summary": "A productive professional development session that provided new tools and renewed enthusiasm."
    }
]


def create_sample_users(db: Session) -> list[User]:
    """Create sample users in the database."""
    users = []
    
    print("Creating sample users...")
    
    for user_data in SAMPLE_USERS:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            print(f"User {user_data['email']} already exists, skipping...")
            users.append(existing_user)
            continue
            
        # Create new user
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=get_password_hash(user_data["password"]),
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        users.append(user)
        
        print(f"Created user: {user.email}")
    
    return users


def create_sample_journal_entries(db: Session, users: list[User]):
    """Create sample journal entries for users."""
    print("Creating sample journal entries...")
    
    # Distribute entries among users
    entries_per_user = [
        3,  # Alice - 3 entries
        3,  # Bob - 3 entries  
        3,  # Carol - 3 entries
        3,  # David - 3 entries
        3   # Emma - 3 entries
    ]
    
    entry_index = 0
    
    for user_index, user in enumerate(users):
        num_entries = entries_per_user[user_index]
        
        for i in range(num_entries):
            if entry_index >= len(SAMPLE_JOURNAL_ENTRIES):
                break
                
            entry_data = SAMPLE_JOURNAL_ENTRIES[entry_index]
            
            # Create entry with a random date in the past 30 days
            days_ago = random.randint(1, 30)
            created_date = datetime.now() - timedelta(days=days_ago)
            
            journal_entry = JournalEntry(
                user_id=user.id,
                title=entry_data["title"],
                content=entry_data["content"],
                mood=entry_data["mood"],
                mood_score=entry_data["mood_score"],
                top_emotions=entry_data["top_emotions"],
                summary=entry_data["summary"],
                analysis_completed=True,
                created_at=created_date,
                updated_at=created_date
            )
            
            db.add(journal_entry)
            entry_index += 1
        
        db.commit()
        print(f"Created {num_entries} journal entries for {user.email}")


def main():
    """Main seeding function."""
    print("🌱 Starting database seeding...")
    
    # Create tables if they don't exist
    create_tables()
    
    # Get database session
    db = get_db_session()
    
    try:
        # Create sample users
        users = create_sample_users(db)
        
        # Create sample journal entries
        create_sample_journal_entries(db, users)
        
        print("\n✅ Database seeding completed successfully!")
        print(f"Created {len(users)} users and {len(SAMPLE_JOURNAL_ENTRIES)} journal entries.")
        print("\nSample login credentials:")
        print("Email: alice@example.com | Password: password123")
        print("Email: bob@example.com | Password: password123") 
        print("Email: carol@example.com | Password: password123")
        print("Email: david@example.com | Password: password123")
        print("Email: emma@example.com | Password: password123")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main() 