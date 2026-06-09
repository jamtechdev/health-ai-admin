'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VitalsLoader } from '@/components/ui/vitals-loader';

export function GlobalRouteLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== lastPath) {
      setLoading(true);
      setLastPath(pathname);
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pathname, lastPath]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <VitalsLoader label="Synchronizing systems..." className="w-full max-w-md" />
      </div>
    );
  }

  return <>{children}</>;
}
