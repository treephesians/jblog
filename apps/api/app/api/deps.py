"""
Dependencies for FastAPI endpoints

This module provides reusable dependencies for:
- Database session injection (get_db)
- User authentication (get_current_user, get_current_active_user)

Authentication Method: HTTP-only Cookies
- JWT token stored in secure, HTTP-only cookie
- Cookie name: "access_token" (configurable in settings)
- Prevents XSS attacks (JavaScript can't access cookie)
- CSRF protection via SameSite=Lax

Why Dependency Injection instead of Middleware?
- Endpoint-level control (some public, some require auth)
- Explicit > Implicit (function signature shows requirements)
- Type safety (current_user: User instead of request.state.user)
- Easy testing (can mock individual dependencies)
"""

from fastapi import Depends, HTTPException, status, Request, Cookie
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from typing import Optional

from app.core.config import settings
from app.db.base import get_db
from app.models.user import User
from app.schemas.token import TokenPayload
from app.services.user import get_user_by_id


def get_current_user(
    db: Session = Depends(get_db),
    access_token: Optional[str] = Cookie(None, alias=settings.COOKIE_NAME),
) -> User:
    """
    Get current authenticated user from JWT cookie

    Reads JWT token from HTTP-only cookie instead of Authorization header.

    Usage:
        @router.get("/me")
        async def get_me(user: User = Depends(get_current_user)):
            return user

    Raises:
        HTTPException 401: If cookie is missing, token is invalid, or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Cookie"},
    )

    if not access_token:
        raise credentials_exception

    try:
        payload = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenPayload(sub=user_id)
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(db, user_id=int(token_data.sub))
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user (is_active=True)

    This is the most common dependency for protected endpoints.

    Usage:
        @router.post("/like")
        async def like_post(user: User = Depends(get_current_active_user)):
            # Only active users can like posts
            ...

    Raises:
        HTTPException 400: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
