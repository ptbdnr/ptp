'use client';

import { useState, useEffect } from 'react';

import MealDiscoveryLayout from './meal-discovery-layout';

import { Meal } from '@/types/meals';
import { Ingredients, Ingredient } from '@/types/ingredients';

import MealCard from '@/components/meal-card/MealCard';

import styles from './meal-discovery.module.css';

import { mockupMeals } from '@/data/meals';
import { mockupIngredients } from '@/data/ingredients';


export default function Page() {
  const [currentIngredients, setCurrentIngredients] = useState<Ingredients>({ingredients: mockupIngredients});
  const [currentRecipe, setCurrentRecipe] = useState<Meal>(mockupMeals[0]);
  const [progress, setProgress] = useState({current: 2, total: mockupMeals.length});
  const [totalPrice, setTotalPrice] = useState({current: 15.25, total: 44});

  return (
    <MealDiscoveryLayout>
        
        <div className={styles.mealSuggestion} >
          <MealCard recipe={currentRecipe}/>
        </div>
        
        <div className={styles.progressIndicator}>
          {progress.current} / {progress.total} meals
          <div className={styles.priceIndicator}>
            ${totalPrice.current} / ${totalPrice.total}
          </div>
        </div>
    </MealDiscoveryLayout>
  );
}