import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query<T>(text: string, params?: any[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows;
}

export async function queryOne<T>(text: string, params?: any[]): Promise<T | null> {
  const res = await pool.query(text, params);
  return res.rows[0] || null;
}
