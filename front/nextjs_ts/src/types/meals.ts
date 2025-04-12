import { Ingredients } from "./ingredients";
import { Equipments } from "./equipments";

export interface Meal {
    id: string;
    name: string;
    images: {
        thumbnail_url: string;
    };
    desciption: string;
    ingredients: Ingredients;
    equipments: Equipments;
}

export interface RecommendedMeals {
    recipes: Meal[];
    missingIngredients: Ingredients;
    missingEquipments: Equipments;
}