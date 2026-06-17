import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ClickStepsContextType {
  currentClick: number;
  totalClicks: number;
  registerClick: (id: string, at: number | string) => number;
  deregisterClick: (id: string) => void;
  setClick: (step: number) => void;
  resetClicks: () => void;
}

export const ClickStepsContext = createContext<ClickStepsContextType | null>(null);

/**
 * Hook to consume active click counts and register click-reveal offsets.
 */
export const useClickStepsContext = (): ClickStepsContextType => {
  const context = useContext(ClickStepsContext);
  if (!context) {
    throw new Error('useClickStepsContext must be used within a ClickStepsProvider');
  }
  return context;
};

interface ClickStepsProviderProps {
  children: React.ReactNode;
  currentClickOverride?: number;
}

/**
 * ClickStepsProvider maintains a reactive registry of all click-reveal elements,
 * calculating total slide clicks and relative thresholds dynamically.
 */
export const ClickStepsProvider: React.FC<ClickStepsProviderProps> = ({
  children,
  currentClickOverride,
}) => {
  const [currentClickState, setCurrentClick] = useState(0);
  const currentClick = currentClickOverride !== undefined ? currentClickOverride : currentClickState;
  const [totalClicks, setTotalClicks] = useState(0);

  // Use refs to track registry state to prevent context refresh loops during mounts
  const registryRef = useRef<Record<string, number>>({});
  const nextRelativeRef = useRef(1);

  const registerClick = useCallback((id: string, at: number | string): number => {
    // Check if already registered
    if (registryRef.current[id] !== undefined) {
      return registryRef.current[id];
    }

    let absoluteStep = 0;

    if (typeof at === 'string' && at.startsWith('+')) {
      const offset = parseInt(at.slice(1), 10) || 1;
      absoluteStep = nextRelativeRef.current;
      nextRelativeRef.current += offset;
    } else if (typeof at === 'string' && at.startsWith('-')) {
      const offset = parseInt(at.slice(1), 10) || 1;
      absoluteStep = Math.max(0, nextRelativeRef.current - offset);
    } else {
      // Absolute index (e.g. 2 or '2')
      absoluteStep = typeof at === 'number' ? at : parseInt(at, 10) || 1;
    }

    registryRef.current[id] = absoluteStep;

    // Recalculate max click step
    const steps = Object.values(registryRef.current);
    const maxStep = steps.length > 0 ? Math.max(...steps) : 0;
    setTotalClicks(maxStep);

    return absoluteStep;
  }, []);

  const deregisterClick = useCallback((id: string) => {
    if (registryRef.current[id] !== undefined) {
      delete registryRef.current[id];
      const steps = Object.values(registryRef.current);
      const maxStep = steps.length > 0 ? Math.max(...steps) : 0;
      setTotalClicks(maxStep);
    }
  }, []);

  const setClick = useCallback((step: number) => {
    setCurrentClick(Math.max(0, step));
  }, []);

  const resetClicks = useCallback(() => {
    registryRef.current = {};
    nextRelativeRef.current = 1;
    setCurrentClick(0);
    setTotalClicks(0);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      currentClick,
      totalClicks,
      registerClick,
      deregisterClick,
      setClick,
      resetClicks,
    }),
    [currentClick, totalClicks, registerClick, deregisterClick, setClick, resetClicks]
  );

  return <ClickStepsContext.Provider value={contextValue}>{children}</ClickStepsContext.Provider>;
};
