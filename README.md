# CodeAlpha Event Registration System

An Event Registration System backend built with Node.js, Express.js, MongoDB and JWT Authentication.

## Features
- User registration and login with JWT authentication
- Password encryption using bcryptjs
- Create and view events
- Register for events with automatic seat management
- View personal registrations
- Cancel registrations with automatic seat restoration
- Duplicate registration prevention

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get token |
| GET | /events | Get all events |
| POST | /events | Create new event |
| POST | /registrations | Register for event |
| GET | /registrations/my | View my registrations |
| DELETE | /registrations/:id | Cancel registration |

## How to run
1. Clone the repo
2. Run npm install
3. Add .env file with MONGODB_URI, PORT and JWT_SECRET
4. Run node index.js
