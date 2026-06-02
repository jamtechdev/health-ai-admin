import type { HealthStatus } from '@/types/health';

interface HealthApiBody {
  reachable?: boolean;
  healthy?: boolean;
  success?: boolean;
  data?: { database?: boolean; redis?: boolean };
}

class HealthService {
  async check(): Promise<HealthStatus> {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const data = (await res.json()) as HealthApiBody;
      const reachable = data?.reachable ?? res.ok;

      return {
        reachable,
        healthy: data?.healthy ?? data?.success === true,
        database: data?.data?.database ?? false,
        redis: data?.data?.redis ?? false,
      };
    } catch {
      return {
        reachable: false,
        healthy: false,
        database: false,
        redis: false,
      };
    }
  }
}

export const healthService = new HealthService();
