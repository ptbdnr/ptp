import { Ingredients } from "./ingredients";
import { Equipments } from "./equipments";

export interface Recipe {
    id: string;
    name: string;
    thumbnail_url: string;
    image_url: string;
    desciption: string;
    ingredients: Ingredients;
    equipments: Equipments;
}

export interface RecommendedRecipes {
    recipes: Recipe[];
    missingIngredients: Ingredients;
    missingEquipments: Equipments;
}