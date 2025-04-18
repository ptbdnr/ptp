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

import { mockupMeals, mockupSupriseMeal } from '@/data/meals';

export default function Page() {
  const { profile } = useProfileContext();
  const { ingredients } = usePantryContext();
  const { setMeals } = useMenuContext();
  const [ stockMeals, setStockMeals ] = useState<Meal[]>(mockupMeals);
  const [ searchMeals, setSearchMeals ] = useState<Meal[]>([]);  
  const [ aiMeals, setAiMeals ] = useState<Meal[]>([]);  
  const surpriseMeal: Meal = mockupSupriseMeal;
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);
  const router = useRouter();

  const toastId = useRef<Id | undefined>(undefined);
  const notifyAIRecommendationStart = () => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast("✨ Smart Recipe Generator", {autoClose: 14000});
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
        console.log(`Meals fetched: ${data.meals.length}`);
        setAiMeals(data.meals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeals();
  }, []);

  const handleSwipe = (
    direction: "left" | "right",
    mealSource: "stock" | "search" | "ai" | "surprise",
    setMeal: React.Dispatch<React.SetStateAction<Meal[]>>
  ) => {
    console.log(`Swiped ${direction} from ${mealSource}`);
    if (direction === "right") {
      setLikedMeals((prev) => [
        ...prev,
        mealSource === "stock"
          ? stockMeals[0]
          : mealSource === "search"
          ? searchMeals[0]
          : mealSource === "ai"
          ? aiMeals[0]
          : surpriseMeal,
      ]);
      setMeals(likedMeals);
    }
    setMeal((prevMeals) => prevMeals.slice(1));
  };
  
  return (
    <MealDiscoveryLayout>
        <div className={styles.mealSuggestion}>
          {stockMeals.length > 0 ? (
            <MealSwipeCard 
              meal={stockMeals[0]}
              // tags={["stock"]}
              onSwipe={(direction) => handleSwipe(direction, "stock", setStockMeals)}
            />
          ) : searchMeals.length > 0 ? (
            <MealSwipeCard 
              meal={searchMeals[0]}
              // tags={["search"]}
              onSwipe={(direction) => handleSwipe(direction, "search", setSearchMeals)}
            />
          ) : aiMeals.length > 0 ? (
            <MealSwipeCard 
              meal={aiMeals[0]}
              // tags={["ai"]}
              onSwipe={(direction) => handleSwipe(direction, "ai", setAiMeals)}
            />
          ) : (
            <MealSwipeCard
              meal={surpriseMeal}
              // tags={["surprise"]}
              onSwipe={(direction) => handleSwipe(direction, "surprise", setAiMeals)}
            />
          )}
        </div>

        <div className={styles.menu}>
          {likedMeals.length == 0 && 
            <div className={styles.menuInstruction}>
              Swipe right to add meal to your menu,<br />left to skip.
            </div>
           }
            {likedMeals.map((meal, index) => (
              <button
                key={meal.id}
                className={styles.menuCard}
                onClick={() => router.push(`/meals/${meal.id}`)}
              >
                <MealCard meal={meal} key={index} card_size="Small" display_cancel={true}/>
              </button>
          ))}
        </div>

        <ToastContainer />
    </MealDiscoveryLayout>
  );
}