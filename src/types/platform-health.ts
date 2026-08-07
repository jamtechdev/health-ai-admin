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
  provider: 'apple_health' | 'oura' | 'health_connect';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string | null;
  metadata?: object | null;
  User?: EmbeddedUser;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: string | null;
  createdAt?: string;
  User?: EmbeddedUser;
}

export interface DeviceSyncLogRecord {
  id: string;
  userId: string;
  provider: 'apple_health' | 'oura' | 'health_connect';
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

export interface MetricGridItem {
  label: string;
  value: string;
  unit: string;
}

export interface TrendSeries {
  recovery: number[];
  steps: number[];
  heartRate: number[];
}

export interface HistorySession {
  id: string;
  name: string;
  value: number;
  unit: string;
  recordedAt: string;
}

export interface HistoryRange {
  from: string;
  to: string;
  label: string;
  days: number;
  helperText: string;
}

export interface HistoryResponse {
  range: HistoryRange;
  metrics: MetricGridItem[];
  trends: TrendSeries;
  sessions: HistorySession[];
  activitySummary: Record<string, unknown>[];
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

export interface UserDeviceDirectoryItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  clientDeviceId: string;
  platform: string | null;
  provider: string | null;
  playerId: string | null;
  modelName: string | null;
  appVersion: string | null;
  lastIp: string | null;
  userAgent: string | null;
  timezone: string | null;
  lastSeenAt: string;
  lastHealthSyncAt: string | null;
  isDebug: boolean | null;
  deviceType: 'debug' | 'release' | null;
  loginStatus: 'logged_in' | 'logged_out';
  activeSessionCount: number;
  pushPlatforms: string[];
  wearableProviders: string[];
}

export interface ActiveSessionItem {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  ip: string | null;
  userAgent: string | null;
  platformGuess: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}
