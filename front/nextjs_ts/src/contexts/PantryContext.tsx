'use client';

import React, { createContext, useContext, useState } from 'react';
import { Ingredients } from '@/types/ingredients';

export interface PantryContextType {
    ingredients: Ingredients;
    setIngredients: (ingredients: Ingredients) => void;
    isLoading: boolean;
    error: string | null;
};

// Create context with default values
const defaultIngredients: Ingredients = {
  ingredients: []
};
const PantryContext = createContext<PantryContextType>({
  ingredients: defaultIngredients,
  setIngredients: () => {},
  isLoading: false,
  error: null
});

// Custom hook for using this context
export const usePantryContext = () => {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error('usePantryContext must be used within a PantryProvider');
  }
  return context;
};

// Provider component
export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredients | null>(null);
  const [isLoading, _setIsLoading] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, _setError] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Add authentication logic here
  
  const value = {
    ingredients: ingredients || defaultIngredients,
    setIngredients: setIngredients,
    isLoading,
    error
  };

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
};