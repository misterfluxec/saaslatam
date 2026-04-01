import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RadSession } from '@/lib/types';

// GET - List sessions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const active = searchParams.get('active') === 'true';
    const username = searchParams.get('username');

    let sql = 'SELECT * FROM radacct WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (active) {
      sql += ' AND acctstoptime IS NULL';
    }

    if (username) {
      sql += ` AND username = $${paramIndex}`;
      params.push(username);
      paramIndex++;
    }

    sql += ' ORDER BY acctstarttime DESC';
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const sessions = await query<RadSession>(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as count FROM radacct WHERE 1=1';
    const countParams: unknown[] = [];
    let countParamIndex = 1;

    if (active) {
      countSql += ' AND acctstoptime IS NULL';
    }

    if (username) {
      countSql += ` AND username = $${countParamIndex}`;
      countParams.push(username);
    }

    const countResult = await query<{ count: string }>(countSql, countParams);
    const total = parseInt(countResult[0]?.count || '0');

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error('Sessions GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// GET bandwidth usage by time period
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period = '24h' } = body;

    let interval: string;
    switch (period) {
      case '7d':
        interval = '7 days';
        break;
      case '30d':
        interval = '30 days';
        break;
      case '24h':
      default:
        interval = '24 hours';
    }

    const result = await query<{
      hour: string;
      upload: string;
      download: string;
      sessions: string;
    }>(
      `SELECT 
        date_trunc('hour', acctstarttime) as hour,
        COALESCE(SUM(acctinputoctets), 0) as upload,
        COALESCE(SUM(acctoutputoctets), 0) as download,
        COUNT(*) as sessions
       FROM radacct 
       WHERE acctstarttime >= NOW() - INTERVAL '${interval}'
       GROUP BY date_trunc('hour', acctstarttime)
       ORDER BY hour DESC
       LIMIT 168`
    );

    return NextResponse.json({
      success: true,
      data: result.map((r) => ({
        hour: r.hour,
        upload: parseInt(r.upload),
        download: parseInt(r.download),
        sessions: parseInt(r.sessions),
      })),
    });
  } catch (error) {
    console.error('Sessions POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bandwidth data' },
      { status: 500 }
    );
  }
}
