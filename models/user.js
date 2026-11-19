import pool from './db.js';

async function createUser(username, passwordHash) {
  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, password_hash',
    [username, passwordHash]
  );
  return result.rows[0];
}

async function getUserByUsername(username) {
  const result = await pool.query(
    'SELECT id, username, password_hash FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
}

export { createUser, getUserByUsername };
