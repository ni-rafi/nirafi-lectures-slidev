import React, { createContext, useContext, useMemo } from 'react';
import type { IFirebaseService } from '@/services/firebase/IFirebaseService';
import { FirebaseService } from '@/services/firebase/firebaseService';

const FirebaseContext = createContext<IFirebaseService | null>(null);

/**
 * Hook to consume the Firebase service from context.
 */
export const useFirebase = (): IFirebaseService => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that instantiates and exposes the Firebase service singleton.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const firebaseService = useMemo(() => {
    const service = new FirebaseService();
    service.initializeFirebase();
    return service;
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseService}>
      {children}
    </FirebaseContext.Provider>
  );
};
