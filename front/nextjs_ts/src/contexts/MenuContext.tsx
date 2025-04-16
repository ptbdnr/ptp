'use client';

import React, { createContext, useContext, useState } from 'react';
import { Meal } from '@/types/meals';

import { mockupMeals } from '@/data/meals';

export interface MenuContextType {
    meals: Meal[];
    setMeals: (meals: Meal[]) => void;
    isLoading: boolean;
    error: string | null;
};

// Create context with default values
const defaultMeals: Meal[] = mockupMeals;
const MenuContext = createContext<MenuContextType>({
  meals: defaultMeals,
  setMeals: () => {},
  isLoading: false,
  error: null
});

// Custom hook for using this context
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

// Provider component
export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [isLoading, _setIsLoading] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, _setError] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Add authentication logic here
  
  const value = {
    meals: meals || defaultMeals,
    setMeals: setMeals,
    isLoading,
    error
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};