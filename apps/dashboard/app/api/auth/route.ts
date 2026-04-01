import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{username: string, groups: string[]}>>> {
  try {
    const { username, password } = await request.json();
    
    // Check user credentials
    const user = await queryOne<{username: string, value: string}>(
      'SELECT username, value FROM radcheck WHERE username = $1 AND attribute = $2',
      [username, 'Cleartext-Password']
    );
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    if (user.value !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid password' 
      }, { status: 401 });
    }
    
    // Get user groups
    const groupsResult = await query<{groupname: string}>(
      'SELECT groupname FROM radusergroup WHERE username = $1',
      [username]
    );
    
    const groups = groupsResult.map(row => row.groupname);
    
    return NextResponse.json({ 
      success: true,
      message: 'Authentication successful',
      data: { username: user.username, groups }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
}
