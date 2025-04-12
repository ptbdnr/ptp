'use client'

import { useState, useEffect } from 'react';

import RecipeDiscoveryLayout from './recipe_discovery-layout';

import { Recipe } from '@/types/recipes';
import { Ingredients, Ingredient } from '@/types/ingredients';

import MealCard from '@/components/meal-card/MealCard';

import styles from './recipe_discovery.module.css';

import { mockupRecipes } from '@/data/recipes';
import { mockupIngredients } from '@/data/ingredients';


export default function Home() {
  const [currentIngredients, setCurrentIngredients] = useState<Ingredients>({ingredients: mockupIngredients});
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(mockupRecipes[0]);
  const [recipeProgress, setRecipeProgress] = useState({current: 2, total: mockupRecipes.length});
  const [totalPrice, setTotalPrice] = useState({current: 15.25, total: 44});
  
  return (
    <RecipeDiscoveryLayout>
      <main className={styles.main}>
        
        <div className={styles.mealSuggestion}>
          <MealCard recipe={currentRecipe} />
        </div>
        
        <div className={styles.progressIndicator}>
          {recipeProgress.current} / {recipeProgress.total} meals
          <div className={styles.priceIndicator}>
            ${totalPrice.current} / ${totalPrice.total}
          </div>
        </div>
      </main>
    </RecipeDiscoveryLayout>
  );
}