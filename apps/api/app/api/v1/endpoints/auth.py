from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.base import get_db
from app.services.oauth import oauth
from app.services import auth as auth_service

router = APIRouter()


def set_auth_cookie(response: Response, token: str) -> None:
    """Set HTTP-only authentication cookie"""
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        max_age=settings.COOKIE_MAX_AGE,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
    )


@router.get("/google/login")
async def google_login(request: Request):
    """Redirect to Google OAuth login"""
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Google OAuth callback - sets auth cookie and redirects to frontend"""
    try:
        token = await oauth.google.authorize_access_token(request)
        access_token = await auth_service.handle_google_oauth_callback(db, token)

        # Create redirect response
        response = RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback")

        # Set HTTP-only cookie
        set_auth_cookie(response, access_token)

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")


@router.post("/logout")
async def logout(response: Response):
    """Logout - clears auth cookie"""
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
    )
    return {"message": "Logged out successfully"}
