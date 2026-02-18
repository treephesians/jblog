from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "Blog API"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # OAuth - Google
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    # Cookie settings
    COOKIE_NAME: str = "access_token"
    COOKIE_MAX_AGE: int = 1800  # 30 minutes (same as token expiry)
    COOKIE_SECURE: bool = False  # Set to True in production (HTTPS only)
    COOKIE_HTTPONLY: bool = True  # Prevent JavaScript access
    COOKIE_SAMESITE: str = "lax"  # CSRF protection

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()
