from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.base import get_db
from app.models.user import User
from app.services import post as post_service
from app.schemas.post import (
    PostLike as PostLikeSchema,
    PostCommentCreate,
    PostCommentUpdate,
    PostComment as PostCommentSchema,
    PostStats,
)

router = APIRouter()


@router.post("/{post_slug}/view")
async def record_post_view(
    post_slug: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Record a post view (anonymous or authenticated)"""
    # Try to get current user (optional)
    try:
        from app.api.deps import get_current_user
        current_user = await get_current_user(db, request)
        user_id = current_user.id
    except:
        user_id = None

    # Get IP and user agent
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    post_service.create_post_view(db, post_slug, user_id, ip_address, user_agent)
    return {"message": "View recorded"}


@router.get("/{post_slug}/stats", response_model=PostStats)
async def get_stats(
    post_slug: str,
    db: Session = Depends(get_db),
):
    """Get post statistics (views, likes, comments)"""
    return post_service.get_post_stats(db, post_slug)


@router.post("/{post_slug}/like", response_model=PostLikeSchema)
async def like_post(
    post_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Like a post (authenticated only)"""
    return post_service.create_post_like(db, post_slug, current_user.id)


@router.delete("/{post_slug}/like")
async def unlike_post(
    post_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Unlike a post"""
    post_service.delete_post_like(db, post_slug, current_user.id)
    return {"message": "Like removed"}


@router.get("/{post_slug}/like/check")
async def check_like(
    post_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Check if current user liked this post"""
    liked = post_service.check_post_like(db, post_slug, current_user.id)
    return {"liked": liked}


@router.get("/{post_slug}/comments", response_model=list[PostCommentSchema])
async def get_comments(
    post_slug: str,
    db: Session = Depends(get_db),
):
    """Get all comments for a post"""
    return post_service.get_post_comments(db, post_slug)


@router.post("/{post_slug}/comments", response_model=PostCommentSchema)
async def create_comment(
    post_slug: str,
    comment_data: PostCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a comment on a post"""
    return post_service.create_comment(
        db,
        post_slug,
        current_user.id,
        comment_data.content,
        comment_data.parent_id,
    )


@router.put("/comments/{comment_id}", response_model=PostCommentSchema)
async def update_comment(
    comment_id: int,
    comment_data: PostCommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a comment (owner only)"""
    return post_service.update_comment(db, comment_id, current_user.id, comment_data.content)


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a comment (soft delete, owner only)"""
    post_service.delete_comment(db, comment_id, current_user.id)
    return {"message": "Comment deleted"}
