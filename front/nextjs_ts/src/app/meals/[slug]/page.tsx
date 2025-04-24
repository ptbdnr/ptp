import { headers } from 'next/headers';

import { Meal } from '@/types/meals';

import MealsLayout from './meals-layout';
import MealDetails from '@/components/meal-details/MealDetails';

import styles from './meals.module.css';

import { mockupMeals } from '@/data/meals';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('slug', slug);
  let meal = mockupMeals.find((meal) => meal.id === slug)
  
  if (!meal) {
    console.log("query database");
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const response = await fetch(`${baseUrl}/api/meals`);
    if (!response.ok) {
      throw new Error('Failed to fetch meal data');
    }
    const mealData = await response.json();
    meal = mealData.meals.find((meal: Meal) => meal.id === slug);
  }
  
  


  return (
    <MealsLayout>
      <div className={styles.content}>
        {meal && <MealDetails meal={meal} />}
      </div>
    </MealsLayout>
  );
}