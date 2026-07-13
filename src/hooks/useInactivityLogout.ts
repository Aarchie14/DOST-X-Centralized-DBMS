import { useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to trigger a logout function after a period of inactivity.
 * @param logoutFn The function to call when the timeout expires.
 * @param idleTimeInMs Time in milliseconds before logging out (e.g., 15 minutes).
 */
export function useInactivityLogout(logoutFn: () => void, idleTimeInMs: number = 900000) {
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(logoutFn, idleTimeInMs);
  }, [logoutFn, idleTimeInMs]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];

    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
}