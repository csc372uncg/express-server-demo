# express-server-demo

This project demonstrates a simple Express.js server with routes for managing books.

## Routes

- `GET /api/books` - Retrieve all books
- `GET /api/books/:id` - Retrieve a book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book by ID
- `DELETE /api/books/:id` - Delete a book by ID
- `GET /api/books?type=fiction` - Retrieve books by type

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
   ```

4. Start the server:
   ```bash
   node --env-file=.env server.js
   ```

   The server will run on `http://localhost:3000` by default.