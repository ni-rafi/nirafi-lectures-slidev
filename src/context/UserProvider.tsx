import React from 'react';
import { UserContext } from './IUserContext';
import { useUserState } from './useUserState';

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userState = useUserState();

  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
};
