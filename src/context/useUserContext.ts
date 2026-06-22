import { useContext } from 'react';
import { UserContext, type UserContextType } from './IUserContext';

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
