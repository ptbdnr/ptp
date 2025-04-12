'use client'

import MealPlanLayout from './meal-plan-layout';

import { BudgetOverview } from '@/components/meal-plan/BudgetOverview';
import { WeekSelector } from '@/components/week-selector/WeekSelector';
import { MealCard } from '@/components/meal-plan/MealCard';
import { ProgressIndicators } from '@/components/meal-plan/ProgressIndicators';

import { mockupMeals } from '@/data/meals';

export default function Page() {

  const recipes = mockupMeals;

  return (
    <MealPlanLayout>
        <BudgetOverview 
          current={15.25} 
          total={44.00} 
          percentage={35} 
        />
        
        <WeekSelector />

        <h3 className="text-[17px] font-semibold text-gray-800">
          Wednesday, April 9
        </h3>

        <div className="space-y-4">
          {recipes.map((recipe, index) => (
            <MealCard key={index} {...recipe} />
          ))}
        </div>

        <ProgressIndicators
          mealsCount={2}
          mealsTotal={12}
          spent={15.25}
          budget={44}
        />
    </MealPlanLayout>
  );
}