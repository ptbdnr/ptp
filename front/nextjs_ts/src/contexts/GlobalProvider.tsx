import React from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { PantryProvider } from '@/contexts/PantryContext';
import { MenuProvider } from './MenuContext';

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProfileProvider>
      <PantryProvider>
        <MenuProvider>
          {children}
          </MenuProvider>
      </PantryProvider>
    </ProfileProvider>
  );
};