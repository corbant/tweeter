import { useRef } from "react";

export function usePresenter<T>(factory: () => T): T {
  const presenterRef = useRef<T | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = factory();
  }

  return presenterRef.current;
}
