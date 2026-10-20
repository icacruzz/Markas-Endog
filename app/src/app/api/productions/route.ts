import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const _url = request.nextUrl.searchParams;
    const rows = await sql`
      SELECT 
        id, 
        user_id, 
        TO_CHAR(date, 'YYYY-MM-DD') as date, 
        egg_trays, 
        loose_eggs, 
        broken_eggs, 
        total_weight_kg::float, 
        total_eggs, 
        notes, 
        created_at
      FROM egg_productions
      ORDER BY date DESC
      LIMIT 100;
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (error: unknown) {
    console.error('Fetch productions error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      egg_trays,
      loose_eggs,
      broken_eggs,
      total_weight_kg,
      notes,
    } = body;

    const trays = Number(egg_trays) || 0;
    const loose = Number(loose_eggs) || 0;
    const broken = Number(broken_eggs) || 0;
    const weight = Number(total_weight_kg) || 0;
    const totalEggs = trays * 30 + loose;
    const id = 'prod_' + Date.now();

    const inserted = await sql`
      INSERT INTO egg_productions (
        id, user_id, date, egg_trays, loose_eggs, broken_eggs, total_weight_kg, total_eggs, notes
      ) VALUES (
        ${id}, 'u1', ${date}, ${trays}, ${loose}, ${broken}, ${weight}, ${totalEggs}, ${notes || ''}
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: unknown) {
    console.error('Create production error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
