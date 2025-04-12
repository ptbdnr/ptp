import { Meal } from '@/types/meals';
import { Ingredient } from '@/types/ingredients';

export function MealCard( recipe: Meal ) {

  const ingredients : Array<Ingredient> = recipe.ingredients.ingredients;
  
    return (
      <div className="bg-white rounded-2xl flex overflow-hidden shadow-sm">
        <div className="w-20 bg-gray-50 flex items-center justify-center text-3xl">
          {recipe.images.thumbnail_url}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">{recipe.name}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">•</span>
              </div>
            </div>
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              ⋮
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Uses: {ingredients.map((ingredient: Ingredient) => ingredient.name).join(', ')}
          </p>
        </div>
      </div>
    );
  }