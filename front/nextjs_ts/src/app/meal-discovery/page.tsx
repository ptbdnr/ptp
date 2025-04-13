'use client';

import React, { useState } from "react";

import type { Meal } from "@/types/meals";

import MealDiscoveryLayout from './meal-discovery-layout';

import MealSwipeCard from '@/components/meal-swipe-card/MealSwipeCard';

import styles from './meal-discovery.module.css';

import { mockupMeals, mockupSupriseMeal } from '@/data/meals';


export default function Page() {
  const [meals, setMeals] = useState(mockupMeals);
  const surpriseMeal: Meal = mockupSupriseMeal;

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction}`);
    setMeals((prev) => prev.slice(1)); // Remove the top card
  };
  
  return (
    <MealDiscoveryLayout>
        
        <div className={styles.mealSuggestion}>
          {meals.length > 0 ? (
            <MealSwipeCard 
              meal={meals[0]}
              onSwipe={handleSwipe} 
            />
          ) : (
            <MealSwipeCard 
              meal={surpriseMeal}
            />
          )}
        </div>

    </MealDiscoveryLayout>
  );
}