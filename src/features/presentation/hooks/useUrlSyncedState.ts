import { useEffect, useState, useCallback, useRef } from 'react';
import { usePresentation } from '../context/PresentationContext';
import { getLectureIdFromPath, storageKeys, getStorageItem, setStorageItem } from '../utils/presentationStorage';

/**
 * useUrlSyncedState synchronizes an interactive component's parameter state across windows/tabs
 * via local storage and storage events, scoped automatically by slide number to avoid naming collisions.
 */
export function useUrlSyncedState<T>(
  key: string,
  defaultValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  let presentation = null;
  try {
    presentation = usePresentation();
  } catch {
    // Return safe fallback outside of presentation provider
  }

  const slideNo = presentation?.slideNo;
  const lectureId = getLectureIdFromPath();

  // Compute storage key scoped by lecture and slide
  const storageKey = storageKeys.syncedParam(lectureId, slideNo, key);

  // Store defaultValue in a ref to avoid infinite re-render loops on object literals
  const defaultValueRef = useRef(defaultValue);
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  const [state, setState] = useState<T>(() => {
    return getStorageItem<T>(storageKey, defaultValueRef.current);
  });

  // Sync state when localStorage changes in another tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setState(getStorageItem<T>(storageKey, defaultValueRef.current));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);

  // Keep state in sync when storageKey updates (e.g. slide change mounts)
  useEffect(() => {
    setState(getStorageItem<T>(storageKey, defaultValueRef.current));
  }, [storageKey]);

  // Update value in local state and set in localStorage to trigger cross-tab sync
  const setSyncedState = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolvedValue = typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
        setStorageItem(storageKey, resolvedValue);
        return resolvedValue;
      });
    },
    [storageKey]
  );

  return [state, setSyncedState];
}

export default useUrlSyncedState;

