import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { useFirebase } from './FirebaseContext';
import { validateRegistration, validateSession, normalizeRegistration, normalizeSession } from '@/cores/user/userValidation';
import type { UserPayload, ThemePreferences } from '@/services/firebase/IFirebaseService';

interface UserContextType {
  rollNumber: string | null;
  session: string | null;
  uid: string | null;
  userProfile: UserPayload | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (rollNumber: string, session: string, name: string, email?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateThemePreferences: (key: string, preferences: ThemePreferences | null) => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserPayload | null>(null);
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
          const profile = await firebaseService.getUserProfile(anonymousUid);
          
          // Determine admin role based on claims or mock credentials
          const auth = getAuth();
          let finalRole: 'student' | 'admin' = profile?.role || 'student';
          
          const mockAdminReg = import.meta.env['VITE_MOCK_ADMIN_REGISTRATION'] || '0000000000';
          const normalizedRoll = normalizeRegistration(storedRoll);
          if (normalizedRoll === mockAdminReg) {
            finalRole = 'admin';
          } else if (auth.currentUser) {
            try {
              const tokenResult = await auth.currentUser.getIdTokenResult(true);
              const is_admin = !!tokenResult.claims['is_admin'] || !!tokenResult.claims['isAdmin'] || tokenResult.claims['role'] === 'admin';
              if (is_admin) {
                finalRole = 'admin';
              }
            } catch (claimErr) {
              console.warn('[UserProvider] Failed to fetch token claims on restore:', claimErr);
            }
          }

          if (profile) {
            profile.role = finalRole;
          }

          setUid(anonymousUid);
          setUserProfile(profile);
          setRollNumber(normalizedRoll);
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
    async (rawRoll: string, rawSession: string, name: string, email?: string): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      // Validate email format if provided
      if (email && email.trim() !== '') {
        const trimmedEmail = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          setError('Invalid email address format.');
          setIsLoading(false);
          return false;
        }
      }

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

        // Determine admin role based on claims or mock credentials
        const auth = getAuth();
        let role: 'student' | 'admin' = 'student';
        
        const mockAdminReg = import.meta.env['VITE_MOCK_ADMIN_REGISTRATION'] || '0000000000';
        if (normalizedRoll === mockAdminReg) {
          role = 'admin';
        } else if (auth.currentUser) {
          try {
            const tokenResult = await auth.currentUser.getIdTokenResult(true);
            const is_admin = !!tokenResult.claims['is_admin'] || !!tokenResult.claims['isAdmin'] || tokenResult.claims['role'] === 'admin';
            if (is_admin) {
              role = 'admin';
            }
          } catch (claimErr) {
            console.warn('[UserProvider] Failed to fetch token claims on login:', claimErr);
          }
        }

        // Save or update profile in backend
        const profile = await firebaseService.setUserProfile(anonymousUid, {
          name: name.trim() || (role === 'admin' ? `Admin ${normalizedRoll}` : `Student ${normalizedRoll}`),
          registration: normalizedRoll,
          session: normalizedSession,
          email: email?.trim() || null,
          role: role,
          isGuest: role === 'student',
        });

        // Save session locally
        localStorage.setItem(STORAGE_KEY_ROLL, normalizedRoll);
        localStorage.setItem(STORAGE_KEY_SESSION, normalizedSession);

        setRollNumber(normalizedRoll);
        setSession(normalizedSession);
        setUid(anonymousUid);
        setUserProfile(profile);
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
    setUserProfile(null);
    setIsLoggedIn(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateThemePreferences = useCallback(
    async (key: string, preferences: ThemePreferences | null) => {
      if (!uid || !userProfile) return;
      try {
        const updatedPreferences = {
          ...(userProfile.themePreferences || {}),
        };
        if (preferences === null) {
          delete updatedPreferences[key];
        } else {
          updatedPreferences[key] = preferences;
        }
        const updatedProfile = await firebaseService.setUserProfile(uid, {
          name: userProfile.name,
          registration: userProfile.registration || null,
          session: userProfile.session || null,
          email: userProfile.email || null,
          role: userProfile.role,
          isGuest: userProfile.isGuest,
          themePreferences: updatedPreferences,
        });
        setUserProfile(updatedProfile);
      } catch (err) {
        console.error('[UserProvider] Failed to update theme preferences:', err);
      }
    },
    [uid, userProfile, firebaseService]
  );

  const contextValue = React.useMemo(
    () => ({
      rollNumber,
      session,
      uid,
      userProfile,
      isLoggedIn,
      isLoading,
      error,
      login,
      logout,
      clearError,
      updateThemePreferences,
    }),
    [
      rollNumber,
      session,
      uid,
      userProfile,
      isLoggedIn,
      isLoading,
      error,
      login,
      logout,
      clearError,
      updateThemePreferences,
    ]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
