from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.oauth_account import OAuthAccount
from app.schemas.user import UserCreate
from app.db.transaction import transactional


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()


def _create_user_no_commit(db: Session, user: UserCreate) -> User:
    """
    Internal helper: Create user without committing

    Used by get_or_create_oauth_user for atomic transactions
    """
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
    )
    db.add(db_user)
    db.flush()  # Get ID without committing
    return db_user


@transactional
def create_user(db: Session, user: UserCreate) -> User:
    """
    Create new user (standalone transaction)

    For use when creating user independently.
    For OAuth flows, use get_or_create_oauth_user instead.
    """
    return _create_user_no_commit(db, user)


@transactional
def get_or_create_oauth_user(
    db: Session,
    provider: str,
    provider_user_id: str,
    email: str,
    full_name: str | None = None,
    avatar_url: str | None = None,
    access_token: str | None = None,
    refresh_token: str | None = None,
) -> User:
    """
    Get or create user from OAuth provider

    @transactional ensures atomicity:
    - Auto commits on success
    - Auto rolls back on exception

    Raises:
        IntegrityError: If concurrent requests create duplicate users
    """
    # Check if OAuth account exists
    oauth_account = (
        db.query(OAuthAccount)
        .filter(
            OAuthAccount.provider == provider,
            OAuthAccount.provider_user_id == provider_user_id,
        )
        .first()
    )

    if oauth_account:
        # Update tokens
        oauth_account.access_token = access_token
        oauth_account.refresh_token = refresh_token
        return oauth_account.user

    # Check if user exists with this email
    user = get_user_by_email(db, email)

    if not user:
        # Create new user (don't commit yet)
        user = _create_user_no_commit(
            db,
            UserCreate(
                email=email,
                full_name=full_name,
                avatar_url=avatar_url,
            ),
        )

    # Create OAuth account
    oauth_account = OAuthAccount(
        user_id=user.id,
        provider=provider,
        provider_user_id=provider_user_id,
        access_token=access_token,
        refresh_token=refresh_token,
    )
    db.add(oauth_account)
    db.flush()  # Get IDs without committing

    # @transactional will auto-commit here
    return user
