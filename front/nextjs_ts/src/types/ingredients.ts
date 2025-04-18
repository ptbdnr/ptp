
export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    images?: {
        placeholder_emoji: string;
    };
}

export interface Ingredients {
    ingredients: Ingredient[];
}

export interface IngredientsContextType {
    ingredients: Ingredients | null;
    setIngredients: (ingredients: Ingredients | null) => void;
    isLoading: boolean;
    error: string | null;
};