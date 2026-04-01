import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { DashboardStats } from '@/lib/types';

export async function GET() {
  try {
    // Total users
    const usersResult = await query<{ count: string }>(
      'SELECT COUNT(DISTINCT username) as count FROM radcheck'
    );
    const totalUsers = parseInt(usersResult[0]?.count || '0');

    // Active sessions (no stop time)
    const activeResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM radacct WHERE acctstoptime IS NULL'
    );
    const activeUsers = parseInt(activeResult[0]?.count || '0');

    // Total clients (APs)
    const clientsResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM radclients'
    );
    const totalClients = parseInt(clientsResult[0]?.count || '0');

    // Total sessions
    const sessionsResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM radacct'
    );
    const totalSessions = parseInt(sessionsResult[0]?.count || '0');

    // Total bandwidth
    const bandwidthResult = await query<{ upload: string; download: string }>(
      'SELECT COALESCE(SUM(acctinputoctets), 0) as upload, COALESCE(SUM(acctoutputoctets), 0) as download FROM radacct'
    );
    const totalBandwidth = {
      upload: parseInt(bandwidthResult[0]?.upload || '0'),
      download: parseInt(bandwidthResult[0]?.download || '0'),
    };

    // Sessions today
    const todayResult = await query<{ count: string }>(
      "SELECT COUNT(*) as count FROM radacct WHERE acctstarttime >= CURRENT_DATE"
    );
    const sessionsToday = parseInt(todayResult[0]?.count || '0');

    // New users today (approximation based on first session)
    const newUsersResult = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT username) as count FROM radacct 
       WHERE username NOT IN (
         SELECT DISTINCT username FROM radacct WHERE acctstarttime < CURRENT_DATE
       ) AND acctstarttime >= CURRENT_DATE`
    );
    const newUsersToday = parseInt(newUsersResult[0]?.count || '0');

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      totalClients,
      totalSessions,
      totalBandwidth,
      sessionsToday,
      newUsersToday,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
