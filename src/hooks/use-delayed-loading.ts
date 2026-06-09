'use client';

import { useState, useEffect, useRef } from 'react';

export function useDelayedLoading(isLoading: boolean, delay = 2000) {
  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      setDelayedLoading(true);
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
    } else {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, delay - elapsed);
        
        const timer = setTimeout(() => {
          setDelayedLoading(false);
          startTimeRef.current = null;
        }, remaining);
        
        return () => clearTimeout(timer);
      } else {
        setDelayedLoading(false);
      }
    }
  }, [isLoading, delay]);

  return delayedLoading;
}
