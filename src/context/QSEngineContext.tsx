import React, { createContext, useContext, useMemo } from 'react';
import type { IQSEngine } from '@/cores/quantity-surveying/IQSEngine';
import { QSEngine } from '@/cores/quantity-surveying/qsService';

const QSEngineContext = createContext<IQSEngine | null>(null);

/**
 * Hook to consume the Quantity Surveying mathematical engine.
 */
export const useQSEngine = (): IQSEngine => {
  const context = useContext(QSEngineContext);
  if (!context) {
    throw new Error('useQSEngine must be used within a QSEngineProvider');
  }
  return context;
};

interface QSEngineProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that instantiates and exposes the QSEngine calculation module.
 */
export const QSEngineProvider: React.FC<QSEngineProviderProps> = ({ children }) => {
  const qsEngine = useMemo(() => new QSEngine(), []);

  return (
    <QSEngineContext.Provider value={qsEngine}>
      {children}
    </QSEngineContext.Provider>
  );
};
