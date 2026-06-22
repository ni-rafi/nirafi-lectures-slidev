import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { useFirebase } from './FirebaseContext';
import { validateRegistration, validateSession, normalizeRegistration, normalizeSession } from '@/cores/user/userValidation';
import type { UserPayload, ThemePreferences } from '@/services/firebase/IFirebaseService';
import { GUEST_UID } from '@/services/firebase/IFirebaseService';
import { FirebaseClaimsSchema } from '@/services/firebase/firebase.schemas';

const STORAGE_KEY_ROLL = 'cee_lectures_roll';
const STORAGE_KEY_SESSION = 'cee_lectures_session';

interface WindowWithGoogle extends Window {
  google?: {
    accounts?: {
      id?: unknown;
    };
  };
}

export const useUserState = () => {
  const firebaseService = useFirebase();
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserPayload | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<{ uid: string; email: string | null; name: string | null } | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = firebaseService.onAuthStateChanged(async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        setIsLoading(true);
        setError(null);
        try {
          const auth = getAuth();
          let is_admin = false;
          if (auth.currentUser) {
            try {
              const tokenResult = await auth.currentUser.getIdTokenResult(true);
              const claimsResult = FirebaseClaimsSchema.safeParse(tokenResult.claims);
              is_admin = claimsResult.success && (
                !!claimsResult.data.is_admin || 
                !!claimsResult.data.isAdmin || 
                claimsResult.data.role === 'admin'
              );
            } catch (claimErr) {
              console.warn('[UserProvider] Failed to fetch token claims on restore:', claimErr);
            }
          }

          let profile = await firebaseService.getUserProfile(firebaseUser.uid);
          if (!isMounted) return;

          if (!profile && is_admin) {
            profile = {
              id: firebaseUser.uid,
              name: auth.currentUser?.displayName || 'Administrator',
              registration: null,
              session: null,
              email: firebaseUser.email,
              role: 'admin',
              isGuest: false,
            };
            await firebaseService.setUserProfile(firebaseUser.uid, {
              name: profile.name,
              registration: null,
              session: null,
              email: profile.email,
              role: 'admin',
              isGuest: false,
            });
          }

          if (profile) {
            profile.role = is_admin ? 'admin' : (profile.role || 'student');

            // Clean up admin profiles to remove student registration and session values
            if (is_admin && (profile.registration !== null || profile.session !== null)) {
              profile.registration = null;
              profile.session = null;
              try {
                await firebaseService.setUserProfile(firebaseUser.uid, {
                  name: profile.name,
                  registration: null,
                  session: null,
                  email: profile.email,
                  role: 'admin',
                  isGuest: false,
                });
              } catch (updateErr) {
                console.warn('[UserProvider] Failed to clean up admin profile fields:', updateErr);
              }
            }

            setUid(firebaseUser.uid);
            setUserProfile(profile);
            setRollNumber(profile.registration || null);
            setSession(profile.session || null);
            setIsLoggedIn(true);
            setNeedsProfileSetup(false);
            setGoogleUser(null);
          } else {
            setGoogleUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: auth.currentUser?.displayName || null,
            });
            setNeedsProfileSetup(true);
            setIsLoggedIn(false);
          }
        } catch (err) {
          console.error('[UserProvider] Failed to restore Google auth profile:', err);
          setError('Failed to restore database session.');
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        const storedRoll = localStorage.getItem(STORAGE_KEY_ROLL);
        const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);

        if (storedRoll === '9999999999' && storedSession && validateSession(storedSession)) {
          const cachedProfile = localStorage.getItem('offline_student_profile');
          const profile = cachedProfile ? JSON.parse(cachedProfile) : {
            id: GUEST_UID,
            name: 'Guest Student',
            registration: '9999999999',
            session: storedSession,
            role: 'student',
            isGuest: true,
          };

          setUid(GUEST_UID);
          setUserProfile(profile);
          setRollNumber('9999999999');
          setSession(storedSession);
          setIsLoggedIn(true);
          setNeedsProfileSetup(false);
          setGoogleUser(null);
        } else {
          setUid(null);
          setUserProfile(null);
          setRollNumber(null);
          setSession(null);
          setIsLoggedIn(false);
          setNeedsProfileSetup(false);
          setGoogleUser(null);
        }
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [firebaseService]);

  useEffect(() => {
    const enableOneTap = false; // Toggle to true when ready to test Google One Tap
    if (!enableOneTap) {
      return;
    }

    const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'];
    if (!clientId) {
      console.warn('[UserProvider] VITE_GOOGLE_CLIENT_ID is not configured.');
      return;
    }

    if (isLoggedIn || isLoading || needsProfileSetup) {
      return;
    }

    let attempts = 0;
    const tryInit = () => {
      const customWindow = window as unknown as WindowWithGoogle;
      if (customWindow.google?.accounts?.id) {
        firebaseService.initializeGoogleOneTap(clientId);
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryInit, 500);
      }
    };

    tryInit();
  }, [isLoggedIn, isLoading, needsProfileSetup, firebaseService]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      await firebaseService.signInWithGoogle();
      return true;
    } catch (err: unknown) {
      console.error('[UserProvider] Google Sign-In failed:', err);
      setError(err instanceof Error ? err.message : 'Google Sign-In failed. Try again.');
      setIsLoading(false);
      return false;
    }
  }, [firebaseService]);

  const completeProfileSetup = useCallback(
    async (rawRoll: string, rawSession: string): Promise<boolean> => {
      if (!googleUser) {
        setError('No active login session found.');
        return false;
      }

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
        setError('Invalid academic session. Standard format is YYYY-YY (e.g., 2016-17).');
        setIsLoading(false);
        return false;
      }

      const normalizedRoll = normalizeRegistration(rawRoll);
      const normalizedSession = normalizeSession(rawSession);

      try {
        const auth = getAuth();
        let role: 'student' | 'admin' = 'student';
        if (auth.currentUser) {
          try {
            const tokenResult = await auth.currentUser.getIdTokenResult(true);
            const claimsResult = FirebaseClaimsSchema.safeParse(tokenResult.claims);
            const is_admin = claimsResult.success && (
              !!claimsResult.data.is_admin || 
              !!claimsResult.data.isAdmin || 
              claimsResult.data.role === 'admin'
            );
            if (is_admin) {
              role = 'admin';
            }
          } catch (claimErr) {
            console.warn('[UserProvider] Failed to fetch token claims on login:', claimErr);
          }
        }

        const profile = await firebaseService.setUserProfile(googleUser.uid, {
          name: googleUser.name || `Student ${normalizedRoll}`,
          registration: normalizedRoll,
          session: normalizedSession,
          email: googleUser.email,
          role: role,
          isGuest: false,
        });

        localStorage.setItem(STORAGE_KEY_ROLL, normalizedRoll);
        localStorage.setItem(STORAGE_KEY_SESSION, normalizedSession);

        setRollNumber(normalizedRoll);
        setSession(normalizedSession);
        setUid(googleUser.uid);
        setUserProfile(profile);
        setIsLoggedIn(true);
        setNeedsProfileSetup(false);
        setGoogleUser(null);
        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        console.error('[UserProvider] Profile setup failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to complete profile registration.');
        setIsLoading(false);
        return false;
      }
    },
    [googleUser, firebaseService]
  );

  const continueAsGuest = useCallback(
    async (name: string, roll: string, sessionVal: string, email?: string): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      const isValidRoll = validateRegistration(roll);
      const isValidSession = validateSession(sessionVal);

      if (!isValidRoll) {
        setError('Registration number must be exactly 10 digits.');
        setIsLoading(false);
        return false;
      }

      if (!isValidSession) {
        setError('Invalid academic session. Standard format is YYYY-YY (e.g., 2016-17).');
        setIsLoading(false);
        return false;
      }

      const normalizedRoll = normalizeRegistration(roll);
      const normalizedSession = normalizeSession(sessionVal);

      try {
        const guestProfile = await firebaseService.setUserProfile(GUEST_UID, {
          name: name.trim() || 'Guest Student',
          registration: normalizedRoll,
          session: normalizedSession,
          email: email?.trim() || null,
          role: 'student',
          isGuest: true,
        });

        localStorage.setItem(STORAGE_KEY_ROLL, normalizedRoll);
        localStorage.setItem(STORAGE_KEY_SESSION, normalizedSession);

        setRollNumber(normalizedRoll);
        setSession(normalizedSession);
        setUid(GUEST_UID);
        setUserProfile(guestProfile);
        setIsLoggedIn(true);
        setNeedsProfileSetup(false);
        setGoogleUser(null);
        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        console.error('[UserProvider] Guest setup failed:', err);
        setError('Guest login failed.');
        setIsLoading(false);
        return false;
      }
    },
    [firebaseService]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_ROLL);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem('offline_student_profile');

    firebaseService.signOut().catch((err) => {
      console.warn('[UserProvider] Failed to sign out from Firebase:', err);
    });

    setRollNumber(null);
    setSession(null);
    setUid(null);
    setUserProfile(null);
    setIsLoggedIn(false);
    setNeedsProfileSetup(false);
    setGoogleUser(null);
    setError(null);
  }, [firebaseService]);

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

  const isAdmin = userProfile?.role === 'admin';

  return {
    rollNumber,
    session,
    uid,
    userProfile,
    isLoggedIn,
    isAdmin,
    isLoading,
    error,
    signInWithGoogle,
    continueAsGuest,
    needsProfileSetup,
    googleUser,
    completeProfileSetup,
    logout,
    clearError,
    updateThemePreferences,
  };
};
