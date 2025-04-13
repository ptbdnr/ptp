# Docker Setup for PTP Project

This document explains how to run the Picture-to-Palatable (PTP) project using
Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Services

The application consists of two main services:

1. **Frontend** (Next.js): Serves the user interface on port 3000
2. **Backend** (FastAPI): Provides the API endpoints on port 8000

## Running the Application

### Start the Application

```bash
# Build and start the services in detached mode
docker-compose up --build -d

# To view logs
docker-compose logs -f
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Stop the Application

```bash
docker-compose down
```

## Environment Variables

The configuration uses environment variables defined in the `.env` file:

- `NEXT_PUBLIC_API_URL`: URL for the backend API (default: http://backend:80)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS (default:
  http://localhost:3000,http://frontend:3000)

## Development Mode

For development with hot-reloading:

1. Create a `docker-compose.dev.yml` file:

```yaml
version: "3.8"

services:
    frontend:
        command: npm run dev
        volumes:
            - ./front/nextjs_ts:/app
            - /app/node_modules

    backend:
        command: uvicorn src.main:app --host 0.0.0.0 --port 80 --reload
        volumes:
            - ./back/sample:/code
```

2. Run with the development configuration:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Troubleshooting

### Camera Access

The camera feature requires HTTPS for security reasons. Options to fix this:

1. **Local Development**:
   - Use `localhost` which is considered secure by browsers
   - Or add a development SSL certificate

2. **Production**:
   - Use a reverse proxy like Nginx with SSL termination
   - Or deploy to a platform that provides HTTPS (like Netlify)

### Connection Issues

If services can't connect to each other:

- Check that the networks are properly configured in docker-compose.yml
- Verify that environment variables are correctly set
- Ensure the CORS configuration allows your frontend origin
