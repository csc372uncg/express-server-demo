import pg from 'pg';
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

await pool.query(`CREATE TABLE IF NOT EXISTS books (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
author TEXT,
read BOOLEAN DEFAULT false,
type TEXT
)`);

await pool.query(`CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL
)`);

export default pool;