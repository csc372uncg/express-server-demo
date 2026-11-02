import pool from './db.js';

async function createBook(title, author, read, type) {
  const result = await pool.query(
    'INSERT INTO books (title, author, read, type) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, read, type]
  );
  return result.rows[0];
}

async function getAllBooks() {
  const result = await pool.query('SELECT * FROM books');
  return result.rows;
}

async function getBookById(id) {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0];
}

async function getBooksByType(type) {
  const result = await pool.query('SELECT * FROM books WHERE type = $1', [type]);
  return result.rows;
}

async function getBooksByAuthor(author) {
  const result = await pool.query('SELECT * FROM books WHERE author ilike $1', [`%${author}%`]);
  return result.rows;
}

async function updateBook(id, title, author, read, type) {
  const result = await pool.query(
    'UPDATE books SET title = $1, author = $2, read = $3, type = $4 WHERE id = $5 RETURNING *',
    [title, author, read, type, id]
  );
  return result.rows[0];
}

async function deleteBook(id) {
  const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

export { createBook, getAllBooks, getBookById, getBooksByType, getBooksByAuthor, updateBook, deleteBook };
