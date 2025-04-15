import { Ingredients } from "./ingredients";
import { Equipments } from "./equipments";

export interface Meal {
    id: string;
    name: string; // 1-5 words
    desciption: string; // 3-10 words
    images: {
        thumbnail_url: string;
        hero_url?: string;
    };
    ingredients: Ingredients;
    equipments?: Equipments;
    instructions?: string;
}

export interface RecommendedMeals {
    recipes: Meal[];
    missingIngredients: Ingredients;
    missingEquipments: Equipments;
}