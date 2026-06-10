export const queryKeys = {
  health: ['health'] as const,
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (page: number, search: string) => ['users', 'list', page, search] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: (page: number, search: string) => ['roles', 'list', page, search] as const,
    detail: (id: string) => ['roles', 'detail', id] as const,
  },
  settings: {
    all: ['settings'] as const,
    list: (page?: number) => ['settings', 'list', page] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (page?: number) => ['notifications', 'list', page] as const,
    detail: (id: string) => ['notifications', 'detail', id] as const,
  },
  uploads: {
    all: ['uploads'] as const,
    list: (page: number) => ['uploads', 'list', page] as const,
  },
  logs: {
    activity: (page: number) => ['activity-logs', page] as const,
    audit: (page: number) => ['audit-logs', page] as const,
  },
  platformHealth: {
    overview: ['platform-health', 'overview'] as const,
    consumers: (page: number, search: string) =>
      ['platform-health', 'consumers', page, search] as const,
    consumer: (userId: string) => ['platform-health', 'consumer', userId] as const,
    devices: (userId: string) => ['platform-health', 'devices', userId] as const,
    metrics: (userId: string, days: number) =>
      ['platform-health', 'metrics', userId, days] as const,
    insights: (userId: string) => ['platform-health', 'insights', userId] as const,
    adminAnalytics: ['platform-health', 'admin-analytics'] as const,
    adminWearables: (page: number, search: string) =>
      ['platform-health', 'admin-wearables', page, search] as const,
    adminInsights: (page: number, search: string) =>
      ['platform-health', 'admin-insights', page, search] as const,
    adminSubscriptions: (page: number, search: string) =>
      ['platform-health', 'admin-subscriptions', page, search] as const,
    adminSyncLogs: (page: number) => ['platform-health', 'admin-sync-logs', page] as const,
    adminApiLogs: (page: number) => ['platform-health', 'admin-api-logs', page] as const,
  },
  accountRequests: {
    all: ['account-requests'] as const,
    list: (page: number) => ['account-requests', 'list', page] as const,
  },
  pages: {
    all: ['pages'] as const,
    list: (page: number, search: string) => ['pages', 'list', page, search] as const,
    detail: (id: string) => ['pages', 'detail', id] as const,
  },
} as const;
