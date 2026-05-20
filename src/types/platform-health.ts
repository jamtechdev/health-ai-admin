export interface HealthPlatformOverview {
  totalConsumers: number;
  connectedDevices: number;
  insightsToday: number;
  totalMetrics: number;
  totalInsights: number;
  integrations: { oura: boolean; openai: boolean };
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

export interface AiInsightRecord {
  id: string;
  userId: string;
  insightType: string;
  title: string;
  body: string;
  recommendation?: string | null;
  healthScore?: number | null;
  generatedAt: string;
}

export interface ConnectedDeviceRecord {
  id: string;
  userId: string;
  provider: 'apple_health' | 'oura';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string | null;
  metadata?: object | null;
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
