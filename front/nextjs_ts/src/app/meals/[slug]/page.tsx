import MealsLayout from './meals-layout';
import MealDetails from '@/components/meal-details/MealDetails';

import styles from './meals.module.css';

import { mockupMeals } from '@/data/meals';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // const router = useRouter()
  const { slug } = await params;
  console.log('slug', slug);
  const meal = mockupMeals.find((meal) => meal.id === "1");
  
  return (
    <MealsLayout>
      <div className={styles.content}>
        {meal && <MealDetails meal={meal} />}
      </div>
    </MealsLayout>
  );
}