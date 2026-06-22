"use client";

import { useCallback, useEffect, useState } from "react";
import { START_CREDITS } from "@/lib/game/economy";

const KEY = "mtm.credits.v1";

// Persists a play-money credit balance in localStorage.
export function useCredits() {
  const [credits, setCredits] = useState(START_CREDITS);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v !== null) {
        const n = Number(v);
        if (Number.isFinite(n)) setCredits(n);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const adjust = useCallback((delta: number) => {
    setCredits((c) => {
      const next = Math.max(0, Math.round((c + delta) * 100) / 100);
      try {
        localStorage.setItem(KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCredits(START_CREDITS);
    try {
      localStorage.setItem(KEY, String(START_CREDITS));
    } catch {
      /* ignore */
    }
  }, []);

  return { credits, adjust, reset };
}
