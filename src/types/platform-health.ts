export interface HealthPlatformOverview {
  totalConsumers: number;
  connectedDevices: number;
  insightsToday: number;
  totalMetrics: number;
  totalInsights: number;
  integrations: { oura: boolean; openai: boolean };
}

export interface AdminAnalyticsOverview {
  totalUsers: number;
  connectedWearables: number;
  metricsToday: number;
  insightsToday: number;
  activeSubscriptions: number;
  failedSyncs: number;
  apiRequestsToday: number;
}

export interface UserHealthProfile {
  id: string;
  userId: string;
  age?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  primaryGoal?: string | null;
  timezone?: string;
}

export interface EmbeddedUser {
  id: string;
  name: string;
  email: string;
}

export interface AiInsightRecord {
  id: string;
  userId: string;
  insightType: string;
  title: string;
  summary?: string | null;
  body: string;
  recommendation?: string | null;
  riskLevel?: 'low' | 'medium' | 'high';
  healthScore?: number | null;
  generatedAt: string;
  User?: EmbeddedUser;
}

export interface ConnectedDeviceRecord {
  id: string;
  userId: string;
  provider: 'apple_health' | 'oura' | 'fitbit' | 'garmin';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string | null;
  metadata?: object | null;
  User?: EmbeddedUser;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
  expiresAt?: string | null;
  createdAt?: string;
  User?: EmbeddedUser;
}

export interface DeviceSyncLogRecord {
  id: string;
  userId: string;
  provider: 'apple_health' | 'oura' | 'fitbit' | 'garmin';
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt?: string | null;
  finishedAt?: string | null;
  metricsSynced: number;
  errorMessage?: string | null;
  createdAt: string;
  User?: EmbeddedUser;
}

export interface ApiLogRecord {
  id: string;
  userId?: string | null;
  requestId?: string | null;
  method: string;
  path: string;
  statusCode?: number | null;
  durationMs?: number | null;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
  User?: EmbeddedUser;
}

export interface HealthMetricRecord {
  id: string;
  userId: string;
  metricType: string;
  value: number;
  unit?: string | null;
  recordedAt: string;
  source?: string | null;
}

export interface ConsumerListItem {
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
    createdAt: string;
  };
  profile: UserHealthProfile | null;
  connectedDevices: number;
  latestInsight: Pick<AiInsightRecord, 'title' | 'healthScore' | 'generatedAt'> | null;
}

export interface ConsumerTableRow extends ConsumerListItem {
  id: string;
}

export interface ConsumerDashboard {
  profile: UserHealthProfile;
  devices: ConnectedDeviceRecord[];
  healthScore: number;
  todayInsight: AiInsightRecord;
  latestMetrics: Record<string, number>;
  integrations: { oura: boolean; openai: boolean };
  pushTokens?: Array<{ platform: string; token: string; updatedAt: string }>;
}
