import { Recipe } from "@/types/recipes";

export const mockupRecipes : Recipe[] = [
    {
      id: "1",
      name: "Simple Veggie Frittata",
      desciption: "A quick and easy frittata packed with veggies.",
      thumbnail_url: "🍳",
      image_url: "TODO",
      ingredients: { 
        ingredients: [
          { id: "1", name: "Eggs", quantity: 4, unit: "pieces" },
          { id: "2", name: "Bell Peppers", quantity: 2, unit: "pieces" },
          { id: "3", name: "Onion", quantity: 1, unit: "pieces" },
          { id: "4", name: "Spinach", quantity: 1, unit: "cup" }
        ]
      },
      equipments: { 
        equipments: [
          { id: "1", name: "Oven", quantity: 1 },
          { id: "2", name: "Skillet", quantity: 1 },
        ]
      },
    },
    {
      id: "2",
      name: "Turkey Avocado Wrap",
      thumbnail_url: "🌯",
      image_url: "TODO",
      desciption: "A healthy wrap with turkey and avocado.",
      ingredients: {
        ingredients: [
          { id: "1", name: "Turkey", quantity: 100, unit: "grams" },
          { id: "2", name: "Avocado", quantity: 1, unit: "pieces" },
          { id: "3", name: "Whole Wheat Wrap", quantity: 1, unit: "pieces" },
          { id: "4", name: "Lettuce", quantity: 1, unit: "cup" }
        ]
      },
      equipments: {
        equipments: [
          { id: "1", name: "Knife", quantity: 1 },
          { id: "2", name: "Cutting Board", quantity: 1 },
        ]
      },
    },
    {
      id: "3",
      name: "Lemon Herb Chicken",
      thumbnail_url: "🍗",
      image_url: "TODO",
      desciption: "Juicy chicken marinated in lemon and herbs.",
      ingredients: {
        ingredients: [
          { id: "1", name: "Chicken", quantity: 2, unit: "pieces" },
          { id: "2", name: "Lemon", quantity: 1, unit: "pieces" },
          { id: "3", name: "Olive Oil", quantity: 2, unit: "tablespoons" },
          { id: "4", name: "Garlic", quantity: 2, unit: "cloves" }
        ]
      },
      equipments: {
        equipments: [
          { id: "1", name: "Grill", quantity: 1 },
          { id: "2", name: "Marinating Container", quantity: 1 },
        ]
      },
    }
  ];