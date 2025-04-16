import React from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { PantryProvider } from '@/contexts/PantryProvider';

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProfileProvider>
      <PantryProvider>
        {children}
      </PantryProvider>
    </ProfileProvider>
  );
};