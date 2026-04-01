// FreeRADIUS Types
export interface RadUser {
  id: number;
  username: string;
  attribute: string;
  op: string;
  value: string;
}

export interface RadClient {
  id: number;
  client_id: string;
  client_secret: string;
  shortname: string;
  nastype: string;
  ports: number | null;
  secret: string;
  server: string | null;
  description: string | null;
}

export interface RadSession {
  radacctid: number;
  acctsessionid: string;
  username: string;
  groupname: string | null;
  realm: string | null;
  nasipaddress: string;
  nasportid: string | null;
  nasporttype: string | null;
  acctstarttime: string | null;
  acctstoptime: string | null;
  acctsessiontime: number;
  acctinputoctets: number;
  acctoutputoctets: number;
  calledstationid: string | null;
  callingstationid: string | null;
  acctterminatecause: string | null;
  framedipaddress: string | null;
}

export interface RadUserGroup {
  id: number;
  username: string;
  groupname: string;
  priority: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalClients: number;
  totalSessions: number;
  totalBandwidth: {
    upload: number;
    download: number;
  };
  sessionsToday: number;
  newUsersToday: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
