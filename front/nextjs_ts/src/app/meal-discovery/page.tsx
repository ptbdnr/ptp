'use client';

import React, { useState } from "react";

import MealDiscoveryLayout from './meal-discovery-layout';

import { Meal } from '@/types/meals';

import MealCard from '@/components/meal-card/MealCard';
import MealSwipeCard from '@/components/meal-swipe-card/MealSwipeCard';

import styles from './meal-discovery.module.css';

import { mockupMeals } from '@/data/meals';


export default function Page() {
  const [cards, setCards] = useState(["Card 1", "Card 2", "Card 3"]);
  const currentRecipe = mockupMeals[0];
  const progress = {current: 2, total: mockupMeals.length};
  const totalPrice = {current: 15.25, total: 44};

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction}`);
    setCards((prev) => prev.slice(1)); // Remove the top card
  };
  
  return (
    <MealDiscoveryLayout>
        
        <div className={styles.mealSuggestion} >
          <MealCard recipe={currentRecipe}/>
        </div>
        <div>
          {cards.length > 0 ? (
            <MealSwipeCard content={cards[0]} onSwipe={handleSwipe} />
          ) : (
            <p>No more cards!</p>
          )}
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