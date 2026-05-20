export interface HealthStatus {
  reachable: boolean;
  healthy: boolean;
  database: boolean;
  redis: boolean;
}
