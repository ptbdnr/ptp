'use client';

import React, { createContext, useContext, useState } from 'react';
import { Profile } from '@/types/profile';

export interface ProfileContextType {
    profile: Profile;
    setProfile: (profile: Profile) => void;
    isLoading: boolean;
    error: string | null;
};

// Create context with default values
const defaultProfile: Profile = {
  weeklyBudget: 50,
  maxPrepTime: 60,
  difficultyLevel: 'Medium',
  dietaryPreferences: ['vegetarian', 'gluten-free'],
};
const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
  isLoading: false,
  error: null
});

// Custom hook for using this context
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

// Provider component
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, _setIsLoading] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, _setError] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Add authentication logic here
  
  const value = {
    profile: profile || defaultProfile,
    setProfile: setProfile,
    isLoading,
    error
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};