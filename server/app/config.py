from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    secret_key: str = "fastapi-insecure-change-me-in-production"
    debug: bool = True
    
    db_name: str = "journaling_app"
    db_user: str = "postgres"
    db_password: str = "password"
    db_host: str = "localhost"
    db_port: str = "5432"
    
    jwt_secret_key: str = "jwt-secret-key-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    openai_api_key: str = "your-openai-api-key-here"
    
    class Config:
        env_file = ".env"
    
    @property
    def database_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


@lru_cache()
def get_settings():
    return Settings() 