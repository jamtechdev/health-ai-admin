'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PlanFeature } from '@/lib/plan-features';
import { createEmptyFeature } from '@/lib/plan-features';

interface PlanFeaturesEditorProps {
  features: PlanFeature[];
  onChange: (features: PlanFeature[]) => void;
}

export function PlanFeaturesEditor({ features, onChange }: PlanFeaturesEditorProps) {
  const updateFeature = (index: number, patch: Partial<PlanFeature>) => {
    onChange(features.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));
  };

  const addFeature = () => {
    onChange([...features, createEmptyFeature()]);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Plan Features</h3>
          <p className="text-xs text-text-muted">
            Add features included or excluded in this plan. Shown to users in the mobile app.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-border/70 bg-surface-secondary/30 px-4 py-8 text-center">
          <p className="text-sm text-text-muted">No features added yet.</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addFeature}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first feature
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div
              key={`feature-${index}`}
              className="rounded-xl border border-brand-border/60 bg-surface-elevated/40 p-4 transition-colors hover:border-brand-primary/20"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-text-muted">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Feature {index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">Feature name</label>
                  <Input
                    value={feature.name}
                    onChange={(e) => updateFeature(index, { name: e.target.value })}
                    placeholder="e.g. Premium AI Insights"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">Description (optional)</label>
                  <textarea
                    value={feature.description ?? ''}
                    onChange={(e) => updateFeature(index, { description: e.target.value })}
                    placeholder="Short description shown to users"
                    rows={2}
                    className="w-full rounded-xl border border-brand-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">Included in plan</label>
                  <div className="flex gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-green-500/40 has-[:checked]:bg-green-500/10 has-[:checked]:text-green-600">
                      <input
                        type="radio"
                        name={`feature-included-${index}`}
                        className="h-4 w-4 accent-green-600"
                        checked={feature.included}
                        onChange={() => updateFeature(index, { included: true })}
                      />
                      Included
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-red-500/40 has-[:checked]:bg-red-500/10 has-[:checked]:text-red-600">
                      <input
                        type="radio"
                        name={`feature-included-${index}`}
                        className="h-4 w-4 accent-red-600"
                        checked={!feature.included}
                        onChange={() => updateFeature(index, { included: false })}
                      />
                      Not included
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
