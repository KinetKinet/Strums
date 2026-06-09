import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

if (!connectionString) {
  console.error('No Postgres connection string found. Set POSTGRES_URL or DATABASE_URL in backend/.env');
}

export const pool = new Pool({ connectionString });

export async function query(text, params) {
  return pool.query(text, params);
}

export default { pool, query };
