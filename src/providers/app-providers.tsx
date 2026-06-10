"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api/client";

const ONESIGNAL_APP_ID =
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ??
  "3ada2ae3-e9c0-4385-aa4c-48ae22db8614";

type OneSignalSubscriptionChange = {
  current?: {
    id?: string | null;
  };
};

type OneSignalSdk = {
  init: (options: {
    appId: string;
    serviceWorkerPath: string;
    serviceWorkerParam: { scope: string };
  }) => Promise<void>;
  Notifications?: {
    permission?: boolean;
    requestPermission?: () => Promise<boolean>;
  };
  User?: {
    PushSubscription?: {
      id?: string | null;
      optIn?: () => Promise<void>;
      addEventListener?: (
        event: "change",
        callback: (event: OneSignalSubscriptionChange) => void | Promise<void>,
      ) => void;
    };
  };
};

declare global {
  interface Window {
    OneSignalDeferred: Array<(OneSignal: OneSignalSdk) => void | Promise<void>>;
    OneSignal?: OneSignalSdk;
  }
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pushListenerAttached = useRef(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal: OneSignalSdk) => {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
        });
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("accessToken")) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: OneSignalSdk) => {
      try {
        const registerSubscription = async (subscriptionId?: string | null) => {
          if (!subscriptionId) return;
          await api.post("/app/push-token", {
            platform: "web",
            token: subscriptionId,
          });
        };

        const permission = OneSignal.Notifications?.permission;
        if (!permission) {
          await OneSignal.Notifications?.requestPermission?.();
        }

        await OneSignal.User?.PushSubscription?.optIn?.();
        await registerSubscription(OneSignal.User?.PushSubscription?.id);

        if (!pushListenerAttached.current) {
          OneSignal.User?.PushSubscription?.addEventListener?.(
            "change",
            async (event: OneSignalSubscriptionChange) => {
              await registerSubscription(
                event?.current?.id ?? OneSignal.User?.PushSubscription?.id,
              );
            },
          );
          pushListenerAttached.current = true;
        }
      } catch (error) {
        console.warn("Failed to register OneSignal push subscription", error);
      }
    });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
      >
        {children}
        <Toaster
          richColors
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-input-value)",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
