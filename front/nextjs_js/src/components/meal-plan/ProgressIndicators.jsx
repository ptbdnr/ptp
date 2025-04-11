export function ProgressIndicators({
    mealsCount,
    mealsTotal,
    spent,
    budget
  }) {
    return (
      <div className="flex justify-between">
        <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-500 shadow-sm">
          {mealsCount} / {mealsTotal} meals
        </div>
        <div className="bg-white px-4 py-2 rounded-full text-sm text-primary font-medium shadow-sm">
          ${spent.toFixed(2)} / ${budget}
        </div>
      </div>
    );
  }