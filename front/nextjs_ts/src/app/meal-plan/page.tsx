import { MealPlanLayout } from './MealPlanLayout';
import { BudgetOverview } from '@/components/meal-plan/BudgetOverview';
import { WeekSelector } from '@/components/meal-plan/WeekSelector';
import { MealCard } from '@/components/meal-plan/MealCard';
import { ProgressIndicators } from '@/components/meal-plan/ProgressIndicators';
import { meals } from '@/data/meals';

export default function MealPlanPage() {
  return (
    <MealPlanLayout>
      <div className="flex-1 bg-gray-50 p-5 space-y-6 overflow-auto">
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
          {meals.map((meal, index) => (
            <MealCard key={index} {...meal} />
          ))}
        </div>

        <ProgressIndicators
          mealsCount={2}
          mealsTotal={12}
          spent={15.25}
          budget={44}
        />
      </div>
    </MealPlanLayout>
  );
}