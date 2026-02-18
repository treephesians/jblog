# Docker Deployment Guide

## Development (Local)

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+

### Quick Start

1. **Copy environment file**
   ```bash
   cd apps/api
   cp .env.docker .env
   # Edit .env and add your OAuth credentials
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on `localhost:5432`
   - FastAPI API on `http://localhost:8000`

3. **Check logs**
   ```bash
   docker-compose logs -f api
   docker-compose logs -f db
   ```

4. **API is ready!**
   - API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

### Useful Commands

```bash
# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# Rebuild API container
docker-compose build api

# Run migrations manually
docker-compose exec api alembic upgrade head

# Create new migration
docker-compose exec api alembic revision --autogenerate -m "description"

# Access database
docker-compose exec db psql -U blog_user -d blog

# View API logs
docker-compose logs -f api

# Restart API only
docker-compose restart api
```

### Hot Reload

In development mode, code changes are automatically reloaded:
- `./app` directory is mounted as volume
- Uvicorn runs with `--reload` flag

Just edit your code and save - the server will restart automatically!

---

## Production

### Prerequisites
- Docker Engine (Linux) or Docker Desktop
- Nginx or reverse proxy (for HTTPS)
- Domain name with SSL certificate

### Production Deployment

1. **Create production environment file**
   ```bash
   cp .env.example .env.prod
   ```

2. **Edit `.env.prod`**
   ```env
   # Database
   DB_USER=blog_user
   DB_PASSWORD=strong-random-password-here
   DB_NAME=blog_prod

   # Security
   SECRET_KEY=super-secret-key-min-32-characters-long

   # OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # URLs
   API_URL=https://api.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Start production services**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

4. **Set up Nginx reverse proxy** (example)
   ```nginx
   server {
       listen 443 ssl http2;
       server_name api.yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Production Best Practices

1. **Use secrets management**
   - Don't commit `.env.prod` to git
   - Use Docker secrets or environment variables from CI/CD

2. **Enable HTTPS**
   - Set `COOKIE_SECURE=true` in production
   - Use reverse proxy (Nginx, Traefik, Caddy)

3. **Database backups**
   ```bash
   # Backup
   docker-compose exec db pg_dump -U blog_user blog > backup.sql

   # Restore
   docker-compose exec -T db psql -U blog_user blog < backup.sql
   ```

4. **Monitor logs**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f --tail=100
   ```

5. **Resource limits**
   Add to `docker-compose.prod.yml`:
   ```yaml
   services:
     api:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
   ```

---

## Dockerfile Explained

### Multi-stage Build

```dockerfile
# Stage 1: Builder - Export dependencies
FROM python:3.11-slim as builder
RUN pip install poetry
RUN poetry export -f requirements.txt --output requirements.txt

# Stage 2: Runtime - Smaller final image
FROM python:3.11-slim
COPY --from=builder /app/requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

**Benefits:**
- Smaller image size (no Poetry in final image)
- Faster builds (layer caching)
- Only runtime dependencies in production

### Security Features

1. **Non-root user**
   ```dockerfile
   RUN useradd -m -u 1000 appuser
   USER appuser
   ```

2. **Health check**
   ```dockerfile
   HEALTHCHECK CMD python -c "import requests; ..."
   ```

3. **Minimal base image**
   - Using `python:3.11-slim` instead of `python:3.11`
   - Reduces attack surface

---

## Troubleshooting

### Database connection error

```bash
# Check if db is healthy
docker-compose ps

# Wait for db to be ready
docker-compose exec api sh -c "until pg_isready -h db -U blog_user; do sleep 1; done"
```

### Port already in use

```bash
# Check what's using port 8000
lsof -i :8000

# Use different port
docker-compose up -d --scale api=0
docker-compose run -p 8001:8000 api
```

### API container keeps restarting

```bash
# Check logs
docker-compose logs api

# Common issues:
# 1. Missing .env file
# 2. Invalid DATABASE_URL
# 3. Missing OAuth credentials
```

### Reset everything

```bash
# Nuclear option - removes all containers, volumes, images
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy API

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          cd apps/api
          docker build -t blog-api:latest .

      - name: Push to registry
        run: |
          docker tag blog-api:latest registry.example.com/blog-api:latest
          docker push registry.example.com/blog-api:latest

      - name: Deploy to server
        run: |
          ssh user@server "docker-compose pull && docker-compose up -d"
```

---

## Performance Tuning

### Uvicorn Workers

For production, use multiple workers:

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

**Workers = (2 × CPU cores) + 1**

### PostgreSQL Tuning

Add to `docker-compose.prod.yml`:

```yaml
db:
  environment:
    POSTGRES_SHARED_BUFFERS: 256MB
    POSTGRES_MAX_CONNECTIONS: 100
  command: postgres -c shared_buffers=256MB -c max_connections=100
```

---

## Next Steps

- [ ] Set up Kubernetes deployment (Step 5)
- [ ] Add Redis for caching
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure auto-scaling
- [ ] Add rate limiting
