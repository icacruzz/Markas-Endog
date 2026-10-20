import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    const text = await file.text();

    // Simple CSV parsing (for server-side use if needed)
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      return headers.reduce((obj, key, i) => ({ ...obj, [key]: values[i] || '' }), {} as Record<string, string>);
    });

    return NextResponse.json({
      success: true,
      rows,
      count: rows.length,
      headers,
    });
  } catch (error) {
    console.error('CSV parse error:', error);
    return NextResponse.json({ error: 'Failed to process CSV file' }, { status: 500 });
  }
}
