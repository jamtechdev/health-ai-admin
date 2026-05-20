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
  },
  settings: {
    all: ['settings'] as const,
    list: (page?: number) => ['settings', 'list', page] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (page?: number) => ['notifications', 'list', page] as const,
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
    metrics: (userId: string, days: number) =>
      ['platform-health', 'metrics', userId, days] as const,
    insights: (userId: string) => ['platform-health', 'insights', userId] as const,
  },
} as const;
