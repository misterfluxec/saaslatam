import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RadUser } from '@/lib/types';

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT DISTINCT ON (username) id, username, attribute, op, value 
      FROM radcheck
    `;
    const params: unknown[] = [];

    if (search) {
      sql += ' WHERE username ILIKE $1';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY username, id DESC';
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const users = await query<RadUser>(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(DISTINCT username) as count FROM radcheck';
    const countParams: unknown[] = [];
    if (search) {
      countSql += ' WHERE username ILIKE $1';
      countParams.push(`%${search}%`);
    }
    const countResult = await query<{ count: string }>(countSql, countParams);
    const total = parseInt(countResult[0]?.count || '0');

    return NextResponse.json({
      success: true,
      data: users,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error('Users GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, attributes } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await query<RadUser>(
      'SELECT id FROM radcheck WHERE username = $1 LIMIT 1',
      [username]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // Insert password
    await query(
      'INSERT INTO radcheck (username, attribute, op, value) VALUES ($1, $2, $3, $4)',
      [username, 'Cleartext-Password', ':=', password]
    );

    // Insert additional attributes if provided
    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        await query(
          'INSERT INTO radcheck (username, attribute, op, value) VALUES ($1, $2, $3, $4)',
          [username, attr.attribute, attr.op || ':=', attr.value]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Users POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM radcheck WHERE username = $1', [username]);
    await query('DELETE FROM radreply WHERE username = $1', [username]);
    await query('DELETE FROM radusergroup WHERE username = $1', [username]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Users DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
