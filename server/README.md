# FastAPI Journal Backend

A powerful journaling app backend built with FastAPI and OpenAI GPT integration for automated mood analysis.

## 🚀 Features

- **User Authentication**: JWT-based authentication with signup, login, and logout
- **Journal Management**: Complete CRUD operations for journal entries
- **Automated Mood Analysis**: OpenAI GPT integration for analyzing emotions and mood
- **REST API**: Modern, fast API with automatic OpenAPI documentation
- **Filtering & Search**: Filter entries by mood, score, emotions, and more
- **Background Processing**: Asynchronous mood analysis with background tasks

## 🛠️ Tech Stack

- **Backend**: FastAPI 0.104.1
- **API**: REST with automatic OpenAPI/Swagger documentation
- **Authentication**: JWT with python-jose
- **Database**: PostgreSQL with SQLAlchemy
- **AI Integration**: OpenAI GPT API
- **Migrations**: Alembic

## 📋 Prerequisites

- Python 3.8+
- pip
- PostgreSQL 12+ (running locally or remote)
- OpenAI API key

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd server
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL**
Install and start PostgreSQL:
```bash
brew install postgresql
brew services start postgresql

sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# On Windows - Download from https://www.postgresql.org/download/windows/
```

5. **Set up environment variables**
Create a `.env` file in the root directory:
```env
SECRET_KEY=fastapi-insecure-change-me-in-production
DEBUG=True
DB_NAME=journaling_app
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET_KEY=jwt-secret-key-change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
OPENAI_API_KEY=your-openai-api-key
```

6. **Initialize database migrations**
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

7. **Run the development server**
```bash
uvicorn main:app --reload
```

8. **Seed the database with sample data (optional)**
To populate your development database with sample users and journal entries:
```bash
python seed_data.py
```

This will create 5 sample users with 15 realistic journal entries. Sample login credentials:
- alice@example.com / password123
- bob@example.com / password123 
- carol@example.com / password123 
- david@example.com / password123 
- emma@example.com / password123 

The API will be available at:
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)
- **API Base**: `http://localhost:8000/`

## 📚 API Documentation

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword",
  "password_confirm": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <your-jwt-token>
```

### Journal Entries

#### Create Entry (with automatic mood analysis)
```http
POST /api/journals/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My Day",
  "content": "Today was amazing! I felt so happy and accomplished after finishing my project."
}
```

#### Get All Entries (with filtering)
```http
GET /api/journals/?mood=Happy&min_mood_score=7.0&limit=20&offset=0
Authorization: Bearer <your-jwt-token>
```

#### Get Single Entry
```http
GET /api/journals/1
Authorization: Bearer <your-jwt-token>
```

#### Update Entry
```http
PUT /api/journals/1
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Entry
```http
DELETE /api/journals/1
Authorization: Bearer <your-jwt-token>
```


### Filtering Options

You can filter journal entries using these query parameters:
- `mood`: Filter by mood string (case-insensitive)
- `min_mood_score`: Minimum mood score (1-10)
- `max_mood_score`: Maximum mood score (1-10)
- `limit`: Maximum number of entries to return (default: 20, max: 100)
- `offset`: Number of entries to skip for pagination (default: 0)

Example:
```http
GET /api/journals/?mood=Happy&min_mood_score=6.0&max_mood_score=9.0&limit=10
Authorization: Bearer <your-jwt-token>
```

## 🤖 Mood Analysis

The system automatically analyzes each new journal entry using OpenAI GPT and extracts:

- **Mood**: Primary emotional state (e.g., "Happy", "Anxious", "Reflective")
- **Mood Score**: Numerical rating from 1-10 (1=very negative, 10=very positive)
- **Top Emotions**: List of 2-4 key emotions detected
- **Summary**: 1-2 sentence overview of the entry's main themes

### Analysis Process

1. **Automatic Trigger**: Analysis runs automatically as a background task when creating new entries
2. **Fallback Handling**: If OpenAI fails, provides neutral fallback analysis
3. **Re-analysis**: Editing entry content triggers automatic re-analysis
4. **Error Resilience**: Entry creation never fails due to analysis errors

## 🔒 Authentication Headers

For authenticated requests, include the JWT token in headers:

```http
Authorization: Bearer <your-jwt-token>
```

## 🏗️ Project Structure

```
server/
├── app/                 # FastAPI application
│   ├── __init__.py     # Package init
│   ├── config.py       # Configuration settings
│   ├── database.py     # Database connection
│   ├── models.py       # SQLAlchemy models
│   ├── schemas.py      # Pydantic schemas
│   ├── auth.py         # Authentication utilities
│   ├── services.py     # Business logic (OpenAI integration)
│   └── routers/        # API route handlers
│       ├── __init__.py
│       ├── auth.py     # Authentication endpoints
│       ├── users.py    # User management endpoints
│       └── journals.py # Journal CRUD endpoints
├── alembic/            # Database migrations
│   ├── env.py
│   └── versions/
├── alembic.ini         # Alembic configuration
├── main.py             # FastAPI application entry point
└── requirements.txt    # Python dependencies
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DB_NAME=journaling_app_prod
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_HOST=your_db_host
DB_PORT=5432
OPENAI_API_KEY=your-openai-api-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Production Database Setup

1. Create production database:
```sql
CREATE DATABASE journaling_app_prod;
CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE journaling_app_prod TO your_db_user;
```

2. Run migrations:
```bash
alembic upgrade head
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **PostgreSQL Connection Error**
   - Ensure PostgreSQL is running: `brew services start postgresql` (macOS) or `sudo systemctl start postgresql` (Linux)
   - Check database credentials in `.env` file
   - Verify database exists: `psql -U postgres -c "CREATE DATABASE journaling_app;"`

2. **OpenAI API Key Error**
   - Ensure your `.env` file contains a valid `OPENAI_API_KEY`
   - Check that the key has sufficient credits

3. **Database Migration Errors**
   - Run `alembic upgrade head` to ensure database is up to date
   - Check Alembic configuration in `alembic.ini`

4. **JWT Authentication Issues**
   - Ensure the token is included in the `Authorization` header as `Bearer <token>`
   - Check token expiration (default: 1 hour)

### Getting Help

- Use the interactive API documentation at `/docs` (Swagger UI) or `/redoc` 
- Review server logs for detailed error information
- Test endpoints using the built-in FastAPI documentation interface

## 🎯 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Mood trend analytics and insights
- [ ] Export entries to PDF/DOCX
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] Background task monitoring and admin interface 