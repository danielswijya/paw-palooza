# Paw Palooza Backend API

A Node.js and Express backend API for the Paw Palooza dog dating application.

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Owners
- `GET /api/owners` - Get all owners
- `GET /api/owners/:id` - Get owner by ID
- `POST /api/owners` - Create a new owner
- `PUT /api/owners/:id` - Update owner by ID
- `DELETE /api/owners/:id` - Delete owner by ID

### Dogs
- `GET /api/dogs` - Get all dogs (with optional query params: `owner_id`, `breed`, `city`)
- `GET /api/dogs/:id` - Get dog by ID
- `POST /api/dogs` - Create a new dog
- `PUT /api/dogs/:id` - Update dog by ID
- `DELETE /api/dogs/:id` - Delete dog by ID
- `GET /api/dogs/:id/reviews` - Get all reviews for a specific dog
- `GET /api/dogs-with-owner` - Get dogs with owner information

### Reviews
- `GET /api/reviews` - Get all reviews (with optional query params: `dog_id`, `owner_id`)
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update review by ID
- `DELETE /api/reviews/:id` - Delete review by ID

### Breeds
- `GET /api/breeds` - Get all breeds
- `GET /api/breeds/:id` - Get breed by ID
- `POST /api/breeds` - Create a new breed
- `PUT /api/breeds/:id` - Update breed by ID
- `DELETE /api/breeds/:id` - Delete breed by ID

### Custom Endpoints
- `GET /api/owners/:id/dogs` - Get all dogs for a specific owner
- `GET /api/dogs-with-owner` - Get dogs with owner information joined

## Example Usage

### Create a Dog
```bash
curl -X POST http://localhost:3000/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "owner-uuid",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 70,
    "sex": 1,
    "neutered": 1,
    "sociability": 5,
    "temperament": 5
  }'
```

### Get All Dogs
```bash
curl http://localhost:3000/api/dogs
```

### Get Dogs by Owner
```bash
curl "http://localhost:3000/api/dogs?owner_id=uuid-here"
```

### Filter Dogs by Breed
```bash
curl "http://localhost:3000/api/dogs?breed=Labrador"
```

## Project Structure

```
backend/
├── server.js              # Main server file
├── routes/                # Modular route files
│   ├── owners.js         # Owner endpoints
│   ├── dogs.js           # Dog endpoints
│   ├── reviews.js        # Review endpoints
│   └── breeds.js         # Breed endpoints
├── package.json
└── README.md
```

## Technologies

- Node.js
- Express
- Supabase (PostgreSQL database)
- CORS enabled for cross-origin requests
- Modular route architecture for better code organization
