"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  Suspense,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface URLStateContextType {
  getParam: (key: string) => string | null;
  setParam: (key: string, value: string) => void;
  setParams: (updates: Record<string, string | null>) => void;
  removeParam: (key: string) => void;
  clearParams: () => void;
  searchParams: URLSearchParams;
}

const URLStateContext = createContext<URLStateContextType | null>(null);

function URLStateProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = {
    getParam: useCallback(
      (key: string) => searchParams.get(key),
      [searchParams]
    ),
    setParam: useCallback(
      (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      },
      [router, pathname, searchParams]
    ),
    setParams: useCallback(
      (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null) params.delete(key);
          else params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      },
      [router, pathname, searchParams]
    ),
    removeParam: useCallback(
      (key: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      },
      [router, pathname, searchParams]
    ),
    clearParams: useCallback(() => {
      router.push(pathname, { scroll: false });
    }, [router, pathname]),
    searchParams,
  };

  return (
    <URLStateContext.Provider value={value}>
      {children}
    </URLStateContext.Provider>
  );
}

export function URLStateProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <URLStateProviderInner>{children}</URLStateProviderInner>
    </Suspense>
  );
}

export function useURLState() {
  const context = useContext(URLStateContext);
  if (!context) {
    throw new Error("useURLState must be used within a URLStateProvider");
  }
  return context;
}
