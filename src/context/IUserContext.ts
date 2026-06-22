import { createContext } from 'react';
import type { UserPayload, ThemePreferences } from '@/services/firebase/IFirebaseService';

export interface UserContextType {
  rollNumber: string | null;
  session: string | null;
  uid: string | null;
  userProfile: UserPayload | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<boolean>;
  continueAsGuest: (name: string, roll: string, sessionVal: string, email?: string) => Promise<boolean>;
  needsProfileSetup: boolean;
  googleUser: { uid: string; email: string | null; name: string | null } | null;
  completeProfileSetup: (rollNumber: string, session: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateThemePreferences: (key: string, preferences: ThemePreferences | null) => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);
