import type { HealthStatus } from '@/types/health';

interface HealthApiBody {
  success?: boolean;
  data?: { database?: boolean; redis?: boolean };
}

class HealthService {
  async check(): Promise<HealthStatus> {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const data = (await res.json()) as HealthApiBody;
      const reachable = res.ok || res.status === 503;

      return {
        reachable,
        healthy: data?.success === true,
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
