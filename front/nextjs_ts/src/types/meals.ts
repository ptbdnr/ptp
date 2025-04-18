import { Ingredients } from "./ingredients";
import { Equipments } from "./equipments";

export interface Meal {
    id: string;
    name: string; // 1-5 words
    description: string; // 3-10 words
    ingredients?: Ingredients;
    equipments?: Equipments;
    instructions?: string;
    images: {
        placeholder_emoji: string;
        hero_url?: string;
    };
    videos?: {
        hero_url?: string;
    };
};

export interface RecommendedMeals {
    recipes: Meal[];
    missingIngredients: Ingredients;
    missingEquipments: Equipments;
};

export interface MealsContextType {
    meals: Meal[] | null;
    setMeals: (meals: Meal[] | null) => void;
    isLoading: boolean;
    error: string | null;
};