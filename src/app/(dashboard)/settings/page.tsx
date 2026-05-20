'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettingsList } from '@/hooks/api/use-settings';

export default function SettingsPage() {
  const { data, isLoading } = useSettingsList();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-slate-500">Global application configuration</p>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(data ?? []).map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="text-base">{s.key}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-600">{JSON.stringify(s.value, null, 2)}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
