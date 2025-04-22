import { headers } from 'next/headers';

import MealsLayout from './meals-layout';
import MealDetails from '@/components/meal-details/MealDetails';

import styles from './meals.module.css';

import { mockupMeals } from '@/data/meals';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // const router = useRouter()
  const { slug } = await params;
  console.log('slug', slug);
  // Inside your component function:
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  // const response = await fetch(`/api/meals?slug=${slug}`);
  const response = await fetch(`${baseUrl}/api/meals`);
  if (!response.ok) {
    throw new Error('Failed to fetch meal data');
  }
  const mealData = await response.json();
  const meal = mockupMeals.find(
    (meal) => meal.id === slug) || mealData.meals.find((meal: any) => meal.id === slug);
  
  return (
    <MealsLayout>
      <div className={styles.content}>
        {meal && <MealDetails meal={meal} />}
      </div>
    </MealsLayout>
  );
}