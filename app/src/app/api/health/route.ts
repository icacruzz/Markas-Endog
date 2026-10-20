import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Reading request URL makes this route dynamic
    const _url = request.nextUrl.searchParams;
    const start = Date.now();
    const result = await sql`SELECT NOW() as current_time, version() as pg_version;`;
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const duration = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      database: 'Neon Lakebase Postgres',
      branch: process.env.NEON_BRANCH || 'production',
      latency_ms: duration,
      result: result[0],
      tables: tables.map((t) => t.table_name),
    });
  } catch (error: unknown) {
    console.error('Database connection error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message },
      { status: 500 }
    );
  }
}
