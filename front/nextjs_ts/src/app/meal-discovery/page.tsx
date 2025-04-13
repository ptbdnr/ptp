'use client';

import { useState } from 'react';

import MealDiscoveryLayout from './meal-discovery-layout';

import { Meal } from '@/types/meals';

import MealCard from '@/components/meal-card/MealCard';

import styles from './meal-discovery.module.css';

import { mockupMeals } from '@/data/meals';


export default function Page() {
  const [currentRecipe] = useState<Meal>(mockupMeals[0]);
  const [progress] = useState({current: 2, total: mockupMeals.length});
  const [totalPrice] = useState({current: 15.25, total: 44});

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