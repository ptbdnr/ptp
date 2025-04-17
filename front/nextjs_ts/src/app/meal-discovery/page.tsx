'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';

import type { Meal } from "@/types/meals";

import { useProfileContext } from '@/contexts/ProfileContext';
import { usePantryContext } from '@/contexts/PantryContext';
import { useMenuContext } from '@/contexts/MenuContext';

import MealDiscoveryLayout from './meal-discovery-layout';

import { ToastContainer, toast, Id } from 'react-toastify';
import MealSwipeCard from '@/components/meal-swipe-card/MealSwipeCard';
import MealCard from "@/components/meal-card/MealCard";

import styles from './meal-discovery.module.css';

import { mockupSupriseMeal } from '@/data/meals';


export default function Page() {
  const { profile } = useProfileContext();
  const { ingredients } = usePantryContext();
  const { meals, setMeals } = useMenuContext();
  const router = useRouter();
  const surpriseMeal: Meal = mockupSupriseMeal;
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);

  const toastId = useRef<Id | undefined>(undefined);
  const notifyAIRecommendationStart = () => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast("🤖 Mistral text generation", {autoClose: 14000});
  }

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        notifyAIRecommendationStart();
        const res = await fetch('/api/meals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            dietaryPreferences: profile.dietaryPreferences,
            maxPrepTime: profile.maxPrepTime,
            ingredients: ingredients.ingredients,
           }),
        });
        toast.dismiss(toastId.current);
        if (!res.ok) {
          throw new Error('Failed to fetch meals');
        }
        const data = await res.json();
        setMeals(data.meals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeals();
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction}`);
    if (direction === "right") {
      setLikedMeals((prev) => [...prev, meals[0]]);
    }
    setMeals(meals.slice(1));
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

        <div className={styles.menu}>
          {likedMeals.length > 0 ? (
            likedMeals.map((meal, index) => (
                <button
                  key={meal.id}
                  className={styles.menuCard}
                  onClick={() => router.push(`/meals/${meal.id}`)}
                >
                  <MealCard meal={meal} key={index} />
                </button>
              ))
          ) : (
            <p>Swipe right to add to menu, left to skip</p>
          )}
        </div>
        <ToastContainer />
    </MealDiscoveryLayout>
  );
}