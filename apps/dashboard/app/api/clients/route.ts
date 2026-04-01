import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RadClient } from '@/lib/types';

// GET - List all clients (Access Points)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const clients = await query<RadClient>(
      'SELECT * FROM radclients ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM radclients'
    );
    const total = parseInt(countResult[0]?.count || '0');

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error('Clients GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, secret, shortname, description, nastype } = body;

    if (!client_id || !secret) {
      return NextResponse.json(
        { success: false, error: 'client_id and secret are required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const existing = await query<RadClient>(
      'SELECT id FROM radclients WHERE client_id = $1 LIMIT 1',
      [client_id]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Client already exists' },
        { status: 409 }
      );
    }

    await query(
      `INSERT INTO radclients (client_id, client_secret, shortname, secret, description, nastype) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [client_id, secret, shortname || client_id, secret, description || '', nastype || 'other']
    );

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
    });
  } catch (error) {
    console.error('Clients POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

// DELETE - Delete client
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('client_id');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'client_id is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM radclients WHERE client_id = $1', [clientId]);

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Clients DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
