
export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    expiryDate?: string;
    images: {
        thumbnail_url: string;
    };
}

export interface Ingredients {
    ingredients: Ingredient[];
}