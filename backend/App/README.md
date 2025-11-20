# App Service

Microservice for managing user, pet, and party data with PostgreSQL backend.

## Features

- CRUD operations for users
- PostgreSQL with Sequelize ORM
- Input validation
- Pagination and filtering
- Health check endpoint
- Rate limiting
- Security headers (Helmet)
- Graceful shutdown


### Health Check (DEBUG level)
```
GET /health
Response: { status: 'ok', service: 'app-service', timestamp, uptime }
```


## Database Schema

### Tables

#### user

- id (UUID, PK)
- name (VARCHAR 30)
- email (VARCHAR 50, UNIQUE)
- age (INTEGER)
- isActive (BOOLEAN, default true)
- createdAt, updatedAt

#### pet

- id (UUID, PK)
- name (VARCHAR 30)
- type (ENUM: 'dog', 'cat', 'other')
- breed (VARCHAR 50)
- age (INTEGER)
- owner_id (UUID, FK → users.id, CASCADE)
- createdAt, updatedAt

#### party

- id (UUID, PK)
- title (VARCHAR 100)
- location (VARCHAR 100)
- date (DATE)
- createdAt, updatedAt

#### party_pets (Junction Table)

- partyId (UUID, FK → parties.id, CASCADE)
- petId (UUID, FK → pets.id, CASCADE)
- createdAt, updatedAt
- PRIMARY KEY (partyId, petId)

### Relationships

#### User → Pet (One-to-Many)

- One user can have multiple pets
- Delete user → cascade delete pets

#### Pet ↔ Party (Many-to-Many)

- Pets can attend multiple parties
- Parties can have multiple pets
- Junction table: party_pets

## API Endpoints

### User Endpoints

```
GET    /api/user                - Get all users (paginated)
GET    /api/user/stats          - Get user statistics
GET    /api/user/:id            - Get user by ID
POST   /api/user                - Create new user
PUT    /api/user/:id            - Update user
DELETE /api/user/:id            - Delete user (cascade pets)
PATCH  /api/user/:id/deactivate - Deactivate user
PATCH  /api/user/:id/activate   - Reactivate user
```

**Create User:**
```json
POST /api/user
{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}
```

**Update User:**
```json
PUT /api/user/:id
{
"name": "Jane Doe",
"age": 31,
"isActive": true
}
```

### Pet Endpoints

```
GET    /api/pet              - Get all pets (paginated)
GET    /api/pet/:id          - Get pet by ID
POST   /api/pet              - Create new pet
PUT    /api/pet/:id          - Update pet
DELETE /api/pet/:id          - Delete pet
GET    /api/pet/:ownerId/get - Get pets by owner ID
GET    /api/pet/:id/party    - Get pet's parties
PATCH  /api/pet/:id/transfer - Transfer pet ownership
```

**Create Pet:**
```json
POST /api/pet
{
  "name": "Max",
  "type": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "owner_id": "user-uuid"
}
```

**Update Pet:**
```json
PUT /api/pet/:id
{
  "type": "dog",
  "age": 5
}
```

***Transfer Ownership:**
```json
PATCH /api/pet/:id/transfer
{
  "newOwnerId": "new-user-uuid"
}
```

### Party Endpoints
```
GET    /api/party                        - Get all party (paginated)
GET    /api/party/:id                    - Get party by ID
POST   /api/party                        - Create new party
PUT    /api/party/:id                    - Update party
DELETE /api/party/:id                    - Delete party
PATCH  /api/party/:partyId/add/:petId    - Add pet to party
PATCH  /api/party/:partyId/remove/:petId - Remove pet from party
```

**Create Party:** (must be future date)
```json
POST /api/party
{
  "title": "Weekend Party",
  "location": "Central Park",
  "date": "2025-12-25T10:00:00Z"
}
```

**Update Party:** (must be future date)
```json
PUT /api/party/:id
{
  "location": "Downtown Club",
  "date": "2025-12-31"
}
```


## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 18

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

4. Create database and user in PostgreSQL

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
docker compose build
```

### Run
```bash
docker compose up -d
```

## Kubernetes Deployment

```bash
# 1. Deploy PostgreSQL
./scripts/deploy-postgres.sh

# 2. Build and push images
docker build -t your-registry/app:latest ./services/App
docker push your-registry/app:latest

docker build -t your-registry/frontend:latest ./frontend
docker push your-registry/frontend:latest


```


## Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage
```


## License

MIT