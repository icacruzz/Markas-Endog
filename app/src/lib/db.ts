import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn('DATABASE_URL is not set. Database queries may fail.');
}

export const sql = neon(databaseUrl);
export default sql;
