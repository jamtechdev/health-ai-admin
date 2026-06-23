export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export function parsePlanFeatures(value: unknown): PlanFeature[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const record = item as Record<string, unknown>;
        const name = typeof record.name === 'string' ? record.name.trim() : '';
        if (!name) return null;
        return {
          name,
          included: Boolean(record.included),
          description:
            typeof record.description === 'string' && record.description.trim()
              ? record.description.trim()
              : undefined,
        } satisfies PlanFeature;
      })
      .filter((item): item is PlanFeature => item !== null);
  }

  return [];
}

export function createEmptyFeature(): PlanFeature {
  return { name: '', included: true, description: '' };
}
