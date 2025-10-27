# Docker Setup for Next.js Application

This document explains how to run the Next.js application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Environment Variables

The application uses the following environment variables:

### Server-side Variables (not exposed to browser)
- `DEBUG_SECRET_VALUE` - Secret key for debugging
- `FLAG` - Flag value for the application

### Public Variables (exposed to browser)
- `NEXT_PUBLIC_ORIGIN` - The origin URL of the application

## Configuration Methods

### Method 1: Using .env.local file (Development)

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values

3. Run with docker-compose (it will read from .env.local):
```bash
docker-compose up --build
```

### Method 2: Using environment variables directly

Set environment variables before running docker-compose:

```bash
export DEBUG_SECRET_VALUE="your-secret-key"
export FLAG="flag{your_flag_value}"
export NEXT_PUBLIC_ORIGIN="http://localhost:3000"

docker-compose up --build
```

### Method 3: Using a custom .env file

1. Create a custom `.env` file:
```bash
DEBUG_SECRET_VALUE=my-secret-key-123
FLAG=flag{test_flag_value}
NEXT_PUBLIC_ORIGIN=http://localhost:3000
```

2. Run docker-compose with the env file:
```bash
docker-compose --env-file .env up --build
```

## Building and Running

### Build the Docker image
```bash
cd my-app
docker-compose build
```

### Run the application
```bash
docker-compose up
```

### Run in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop the application
```bash
docker-compose down
```

## Accessing the Application

Once running, the application will be available at:
- http://localhost:3000

## Docker Commands Reference

### Rebuild without cache
```bash
docker-compose build --no-cache
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

### Execute commands in running container
```bash
docker-compose exec nextjs-app sh
```

## Production Deployment

For production deployment, ensure you:

1. Set proper environment variables with secure values
2. Update `NEXT_PUBLIC_ORIGIN` to your production domain
3. Consider using Docker secrets or a secrets management service
4. Review and adjust the health check settings in docker-compose.yml

## Troubleshooting

### Port already in use
If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Environment variables not working
- Ensure variables are properly set before running docker-compose
- Check that NEXT_PUBLIC_* variables are set at build time for client-side access
- Server-side variables can be set at runtime

### Build fails
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`