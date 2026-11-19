# express-server-demo

This project demonstrates a simple Express.js server with routes for managing books.

## Routes

- `GET /api/books` - Retrieve all books
- `GET /api/books/:id` - Retrieve a book by ID
- `POST /api/books` - Create a new book (requires login)
- `PUT /api/books/:id` - Update a book by ID
- `DELETE /api/books/:id` - Delete a book by ID (requires login)
- `GET /api/books?type=fiction` - Retrieve books by type
- `POST /api/auth/signup` - Create an account with `{ "username": "...", "password": "..." }`
- `POST /api/auth/login` - Log in with `{ "username": "...", "password": "..." }`
- `POST /api/auth/logout` - End the current session
- `GET /api/auth/me` - Get the current session user

## Setup

1. Clone the repository:
   ```bash
   git clone <github_url>
   cd express-server-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database connection string:
   ```bash
   DATABASE_URL=your_neon_database_connection_string
   SESSION_SECRET=your_long_random_session_secret
   ```
   `SESSION_SECRET` should be a long, random value and must be kept private. Users are stored in the `users` PostgreSQL table with bcrypt-hashed passwords. The default Express session store is in-memory, so sessions end when the server restarts; use a persistent session store for production.

4. Start the server:
   ```bash
   node --env-file=.env server.js
   ```

   The server will run on `http://localhost:3000` by default.

   ## Web interface

   Open `http://localhost:3000` to view your book gallery. Create an account or log in to add and delete books. Select a book to view or edit its details.