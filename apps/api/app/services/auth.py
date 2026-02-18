from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.services.user import get_or_create_oauth_user


async def handle_google_oauth_callback(db: Session, token: dict) -> str:
    """
    Handle Google OAuth callback

    Args:
        db: Database session
        token: OAuth token response from Google

    Returns:
        JWT access token for frontend

    Raises:
        HTTPException: If user info cannot be retrieved
    """
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")

    # Get or create user
    user = get_or_create_oauth_user(
        db=db,
        provider="google",
        provider_user_id=user_info["sub"],
        email=user_info["email"],
        full_name=user_info.get("name"),
        avatar_url=user_info.get("picture"),
        access_token=token.get("access_token"),
        refresh_token=token.get("refresh_token"),
    )

    # Create JWT access token
    return create_access_token(subject=user.id)
