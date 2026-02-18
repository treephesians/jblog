# Blog API

FastAPI backend for tech learning blog.

## Features

- **Authentication:** HTTP-only cookie-based JWT (Google OAuth)
- **Post interactions:** Views, likes, comments (with nested replies)
- **Database:** PostgreSQL with Alembic migrations
- **Architecture:** Layered architecture with transaction management
- **Deployment:** Docker + Docker Compose ready

## Quick Start (Docker)

**Fastest way to get started:**

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Add your OAuth credentials to .env

# 3. Start with Docker
docker-compose up -d

# 4. API is ready!
# - Docs: http://localhost:8000/docs
# - Health: http://localhost:8000/health
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

---

## Local Development (without Docker)

### Prerequisites
- Python 3.11+
- Poetry
- PostgreSQL 16

### Setup

```bash
# Install dependencies
poetry install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
poetry run alembic upgrade head

# Start development server
poetry run uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000

---

## Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide (Poetry, PostgreSQL, OAuth)
- [DOCKER.md](./DOCKER.md) - Docker deployment guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Code architecture & patterns
- [TRANSACTION.md](./TRANSACTION.md) - Transaction management guide

---

## API Documentation

Interactive API docs: http://localhost:8000/docs

### Key Endpoints

**Authentication**
- `GET /api/v1/auth/google/login` - Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/logout` - Logout (clears cookie)

**Posts**
- `POST /api/v1/posts/{slug}/view` - Record view
- `GET /api/v1/posts/{slug}/stats` - Get stats
- `POST /api/v1/posts/{slug}/like` - Like post (auth required)
- `GET /api/v1/posts/{slug}/comments` - Get comments

---

## Technology Stack

- **Framework:** FastAPI 0.115+
- **Database:** PostgreSQL 16 + SQLAlchemy 2.0
- **Authentication:** JWT (HTTP-only cookies) + OAuth 2.0
- **Migrations:** Alembic
- **Deployment:** Docker + Docker Compose
