import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn('DATABASE_URL is not set. Database queries may fail.');
}

// Safe fallback when DATABASE_URL is missing during build time
const safeUrl = databaseUrl || 'postgresql://placeholder:placeholder@ep-placeholder.us-east-2.aws.neon.tech/neondb';
export const sql = neon(safeUrl);
export default sql;
