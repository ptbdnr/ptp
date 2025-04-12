
export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    expiryDate?: string;
}

export interface Ingredients {
    ingredients: Ingredient[];
}