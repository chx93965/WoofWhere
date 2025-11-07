# User Service

Microservice for managing user data with PostgreSQL backend.

## Features

- CRUD operations for users
- PostgreSQL with Sequelize ORM
- Input validation
- Pagination and filtering
- Health check endpoint
- Rate limiting
- Security headers (Helmet)
- Graceful shutdown

## API Endpoints

### Health Check
```
GET /health
Response: { status: 'ok', service: 'user-service', timestamp, uptime }
```

### Users
```
GET    /api/users              - Get all users (paginated)
GET    /api/users/stats        - Get user statistics
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
PATCH  /api/users/:id/deactivate - Deactivate user
DELETE /api/users/:id          - Delete user
```

### Query Parameters (GET /api/users)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or email
- `isActive` - Filter by active status (true/false)

### Request/Response Examples

**Create User:**
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

Response: 201 Created
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Get Users (Paginated):**
```json
GET /api/users?page=1&limit=10&search=john

Response: 200 OK
{
  "users": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Create database and user in PostgreSQL:
```sql
CREATE DATABASE userdb;
CREATE USER user_service WITH PASSWORD 'userpass123';
GRANT ALL PRIVILEGES ON DATABASE userdb TO user_service;
```

5. Run the service:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## Docker

### Build
```bash
docker build -t user-service:latest .
```

### Run
```bash
docker run -p 3001:3001 \
  -e DB_HOST=postgres \
  -e DB_NAME=userdb \
  -e DB_USER=user_service \
  -e DB_PASSWORD=userpass123 \
  user-service:latest
```

## Kubernetes Deployment

See parent directory `k8s/deployments/user-service.yaml`

```bash
kubectl apply -f k8s/deployments/app-service.yaml
kubectl apply -f k8s/services/app-service.yaml
```

## Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_isActive ON users("isActive");
CREATE INDEX idx_users_createdAt ON users("createdAt");
```

## Environment Variables

| Variable | Description | Default     |
|----------|-------------|-------------|
| NODE_ENV | Environment | development |
| PORT | Server port | 4001        |
| DB_HOST | PostgreSQL host | localhost   |
| DB_PORT | PostgreSQL port | 5432       |
| DB_NAME | Database name | userdb      |
| DB_USER | Database user | user        |
| DB_PASSWORD | Database password | password    |

## Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage
```

## Troubleshooting

### Connection Issues
```bash
# Test database connection
psql -h localhost -U user_service -d userdb

# Check if service is running
curl http://localhost:3001/health
```

### Permission Issues
```sql
-- Reconnect as postgres and grant permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO user_service;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_service;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_service;
```

## License

MIT