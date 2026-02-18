from functools import wraps
from typing import Callable, Any
from sqlalchemy.orm import Session


def transactional(func: Callable) -> Callable:
    """
    Decorator for automatic transaction management.

    Automatically commits on success, rolls back on exception.

    Usage:
        @transactional
        def create_user(db: Session, user_data: dict):
            user = User(**user_data)
            db.add(user)
            # Auto commits here

    Note: The first parameter must be a SQLAlchemy Session named 'db'
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        # Find db session in args or kwargs
        db = kwargs.get('db') or (args[0] if args and isinstance(args[0], Session) else None)

        if db is None:
            raise ValueError("transactional decorator requires 'db: Session' parameter")

        try:
            result = func(*args, **kwargs)
            db.commit()
            return result
        except Exception:
            db.rollback()
            raise

    return wrapper


def transactional_async(func: Callable) -> Callable:
    """
    Async version of transactional decorator.

    Usage:
        @transactional_async
        async def create_user(db: Session, user_data: dict):
            user = User(**user_data)
            db.add(user)
    """
    @wraps(func)
    async def wrapper(*args, **kwargs) -> Any:
        db = kwargs.get('db') or (args[0] if args and isinstance(args[0], Session) else None)

        if db is None:
            raise ValueError("transactional_async decorator requires 'db: Session' parameter")

        try:
            result = await func(*args, **kwargs)
            db.commit()
            return result
        except Exception:
            db.rollback()
            raise

    return wrapper
