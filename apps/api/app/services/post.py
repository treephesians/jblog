from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from fastapi import HTTPException

from app.db.transaction import transactional
from app.models.post_interaction import PostView, PostLike, PostComment
from app.schemas.post import PostStats


@transactional
def create_post_like(db: Session, post_slug: str, user_id: int) -> PostLike:
    """
    Create a post like

    Raises:
        HTTPException: 400 if already liked
    """
    try:
        post_like = PostLike(post_slug=post_slug, user_id=user_id)
        db.add(post_like)
        db.flush()  # Check constraint before commit
        return post_like
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Already liked this post")


@transactional
def delete_post_like(db: Session, post_slug: str, user_id: int) -> None:
    """
    Delete a post like

    Raises:
        HTTPException: 404 if like not found
    """
    post_like = db.query(PostLike).filter(
        PostLike.post_slug == post_slug,
        PostLike.user_id == user_id,
    ).first()

    if not post_like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(post_like)


@transactional
def create_comment(
    db: Session,
    post_slug: str,
    user_id: int,
    content: str,
    parent_id: int | None = None,
) -> PostComment:
    """
    Create a comment

    Raises:
        HTTPException: 404 if parent comment not found
    """
    # Validate parent comment exists
    if parent_id:
        parent = db.query(PostComment).filter(
            PostComment.id == parent_id,
            PostComment.post_slug == post_slug,
        ).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent comment not found")

    comment = PostComment(
        post_slug=post_slug,
        user_id=user_id,
        content=content,
        parent_id=parent_id,
    )
    db.add(comment)
    db.flush()
    return comment


@transactional
def update_comment(db: Session, comment_id: int, user_id: int, content: str) -> PostComment:
    """
    Update a comment

    Raises:
        HTTPException: 404 if comment not found, 403 if not owner
    """
    comment = db.query(PostComment).filter(PostComment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")

    comment.content = content
    return comment


@transactional
def delete_comment(db: Session, comment_id: int, user_id: int) -> None:
    """
    Soft delete a comment

    Raises:
        HTTPException: 404 if comment not found, 403 if not owner
    """
    comment = db.query(PostComment).filter(PostComment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    comment.is_deleted = True


@transactional
def create_post_view(
    db: Session,
    post_slug: str,
    user_id: int | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    """
    Record a post view

    Can be called by anonymous or authenticated users
    """
    post_view = PostView(
        post_slug=post_slug,
        user_id=user_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(post_view)


def get_post_stats(db: Session, post_slug: str) -> PostStats:
    """
    Get post statistics (views, likes, comments)

    Read-only, no transaction needed
    """
    view_count = db.query(func.count(PostView.id)).filter(
        PostView.post_slug == post_slug
    ).scalar()

    like_count = db.query(func.count(PostLike.id)).filter(
        PostLike.post_slug == post_slug
    ).scalar()

    comment_count = db.query(func.count(PostComment.id)).filter(
        PostComment.post_slug == post_slug,
        PostComment.is_deleted == False,
    ).scalar()

    return PostStats(
        post_slug=post_slug,
        view_count=view_count or 0,
        like_count=like_count or 0,
        comment_count=comment_count or 0,
    )


def check_post_like(db: Session, post_slug: str, user_id: int) -> bool:
    """
    Check if user has liked a post

    Read-only, no transaction needed

    Returns:
        True if user has liked the post, False otherwise
    """
    post_like = db.query(PostLike).filter(
        PostLike.post_slug == post_slug,
        PostLike.user_id == user_id,
    ).first()

    return post_like is not None


def get_post_comments(db: Session, post_slug: str) -> list[PostComment]:
    """
    Get all comments for a post

    Read-only, no transaction needed
    """
    return db.query(PostComment).filter(
        PostComment.post_slug == post_slug,
        PostComment.is_deleted == False,
    ).order_by(PostComment.created_at.desc()).all()
