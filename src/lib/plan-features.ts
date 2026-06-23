export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export function parsePlanFeatures(value: unknown): PlanFeature[] {
  if (!value || !Array.isArray(value)) return [];

  const features: PlanFeature[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    if (!name) continue;

    const feature: PlanFeature = {
      name,
      included: Boolean(record.included),
    };

    if (typeof record.description === 'string' && record.description.trim()) {
      feature.description = record.description.trim();
    }

    features.push(feature);
  }

  return features;
}

export function createEmptyFeature(): PlanFeature {
  return { name: '', included: true, description: '' };
}
