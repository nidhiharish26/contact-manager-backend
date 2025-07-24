# Contact Manager Backend

This is the backend API for the Contact Manager application built using Node.js and Express. It handles user authentication and contact Create, Sort and Search operations.

## Features

- User registration and login
- JWT-based authentication
- Create, search and sort contacts
- Protected routes

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or cloud - e.g., MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nidhiharish26/contact-manager.git
   

2. Navigate to the backend directory:

   ```bash
   cd contact-manager/backend
   

3. Install dependencies:

   ```bash
   npm install
   

4. Create a .env file in the root of the backend folder and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   

5. Start the development server:

   ```bash
   npm run dev
   

The server will start at http://localhost:5000.

## API Endpoints

### Auth Routes

- POST /api/users/register - Register a new user
- POST /api/users/login - Login and receive JWT token

### Contact Routes (Protected)

- GET /api/contacts - Get all user contacts
- POST /api/contacts - Create a new contact
- PUT /api/contacts/:id - Update a contact
- DELETE /api/contacts/:id - Delete a contact

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Notes

- Add your MongoDB connection string and JWT secret in the .env file
- Do not commit your .env file
- Use Postman, thunder client or frontend to test endpoints

