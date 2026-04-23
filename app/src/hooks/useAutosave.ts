"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

interface Options<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delayMs?: number;
  // 比較兩次資料，回傳 true 代表無變化，跳過儲存
  // 未提供時以 JSON.stringify 比對
  equals?: (a: T, b: T) => boolean;
}

interface Result {
  status: AutosaveStatus;
  savedAt: Date | null;
  isDirty: boolean;
  flush: () => Promise<void>;
}

// 5 秒 debounce autosave，搭配 beforeunload 未儲存提示
export function useAutosave<T>({
  data,
  onSave,
  delayMs = 5000,
  equals,
}: Options<T>): Result {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const baselineRef = useRef<T>(data);
  const latestRef = useRef<T>(data);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const isSame = useCallback(
    (a: T, b: T) => (equals ? equals(a, b) : JSON.stringify(a) === JSON.stringify(b)),
    [equals]
  );

  const doSave = useCallback(async () => {
    if (inFlightRef.current) return;
    const snapshot = latestRef.current;
    if (isSame(snapshot, baselineRef.current)) {
      setStatus("saved");
      return;
    }
    inFlightRef.current = true;
    setStatus("saving");
    try {
      await onSaveRef.current(snapshot);
      baselineRef.current = snapshot;
      setSavedAt(new Date());
      // 儲存完成後若使用者又改了，狀態回到 dirty
      if (!isSame(latestRef.current, baselineRef.current)) {
        setStatus("dirty");
      } else {
        setStatus("saved");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  }, [isSame]);

  useEffect(() => {
    latestRef.current = data;
    if (isSame(data, baselineRef.current)) {
      // 無變動，保留現有 status（idle / saved）
      return;
    }
    setStatus("dirty");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, delayMs, doSave, isSame]);

  const isDirty = status === "dirty" || status === "saving" || status === "error";

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    await doSave();
  }, [doSave]);

  return { status, savedAt, isDirty, flush };
}
