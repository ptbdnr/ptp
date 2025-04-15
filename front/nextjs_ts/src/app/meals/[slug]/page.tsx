import MealsLayout from './meals-layout';
import MealDetails from '@/components/meal-details/MealDetails';

import { mockupMeals } from '@/data/meals';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // const router = useRouter()
  const { slug } = await params;
  console.log('slug', slug);
  const meal = mockupMeals[0];
  
  return (
    <MealsLayout>
      <MealDetails meal={meal} />
    </MealsLayout>
  );
}