from datetime import datetime
from pydantic import BaseModel


class PostLike(BaseModel):
    id: int
    post_slug: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PostCommentCreate(BaseModel):
    content: str
    parent_id: int | None = None


class PostCommentUpdate(BaseModel):
    content: str


class PostComment(BaseModel):
    id: int
    post_slug: str
    user_id: int
    parent_id: int | None
    content: str
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostStats(BaseModel):
    post_slug: str
    view_count: int
    like_count: int
    comment_count: int
