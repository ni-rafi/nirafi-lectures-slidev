import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFirebase } from './FirebaseContext';
import { validateRegistration, validateSession, normalizeRegistration, normalizeSession } from '@/cores/user/userValidation';

interface UserContextType {
  rollNumber: string | null;
  session: string | null;
  uid: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (rollNumber: string, session: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

/**
 * Hook to consume the student session and verification status.
 */
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY_ROLL = 'cee_lectures_roll';
const STORAGE_KEY_SESSION = 'cee_lectures_session';

/**
 * UserProvider manages active student session states, validation checks, and Firebase sign-in triggers.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const firebaseService = useFirebase();
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedRoll = localStorage.getItem(STORAGE_KEY_ROLL);
      const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);

      if (storedRoll && storedSession && validateRegistration(storedRoll) && validateSession(storedSession)) {
        try {
          const anonymousUid = await firebaseService.anonymousSignIn();
          setUid(anonymousUid);
          setRollNumber(normalizeRegistration(storedRoll));
          setSession(normalizeSession(storedSession));
          setIsLoggedIn(true);
        } catch (err) {
          console.error('[UserProvider] Failed to restore anonymous session:', err);
          setError('Failed to restore database session. Running in offline mode.');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, [firebaseService]);

  const login = useCallback(
    async (rawRoll: string, rawSession: string): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      const isValidRoll = validateRegistration(rawRoll);
      const isValidSession = validateSession(rawSession);

      if (!isValidRoll) {
        setError('Invalid registration number. Must be exactly 10 digits.');
        setIsLoading(false);
        return false;
      }

      if (!isValidSession) {
        setError('Invalid academic session. Standard format is YYYY-YY (e.g., 2020-21).');
        setIsLoading(false);
        return false;
      }

      const normalizedRoll = normalizeRegistration(rawRoll);
      const normalizedSession = normalizeSession(rawSession);

      try {
        // Sign in anonymously
        const anonymousUid = await firebaseService.anonymousSignIn();

        // Save or update profile in backend
        await firebaseService.setUserProfile(anonymousUid, {
          name: `Student ${normalizedRoll}`,
          registration: normalizedRoll,
          session: normalizedSession,
          role: 'student',
          isGuest: true,
        });

        // Save session locally
        localStorage.setItem(STORAGE_KEY_ROLL, normalizedRoll);
        localStorage.setItem(STORAGE_KEY_SESSION, normalizedSession);

        setRollNumber(normalizedRoll);
        setSession(normalizedSession);
        setUid(anonymousUid);
        setIsLoggedIn(true);
        setIsLoading(false);
        return true;
      } catch (err) {
        console.error('[UserProvider] Login sequence failed:', err);
        setError('Authentication service error. Try again.');
        setIsLoading(false);
        return false;
      }
    },
    [firebaseService]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_ROLL);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setRollNumber(null);
    setSession(null);
    setUid(null);
    setIsLoggedIn(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      rollNumber,
      session,
      uid,
      isLoggedIn,
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [rollNumber, session, uid, isLoggedIn, isLoading, error, login, logout, clearError]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
