import { Meal } from "@/types/meals";

export const mockupMeals : Meal[] = [
    {
      id: "1",
      name: "Simple Veggie Frittata",
      description: "A quick and easy frittata packed with veggies.",
      images: {
        placeholder_emoji: "🍳",
      },
      ingredients: { 
        ingredients: [
          { id: "1", name: "Eggs", quantity: 4, unit: "pieces"},
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
      instructions: "1. Preheat oven to 375°F (190°C).\n2. Dice bell peppers and onion.\n3. Heat skillet over medium heat and sauté peppers and onions until soft, about 5 minutes.\n4. Add spinach and cook until wilted.\n5. Whisk eggs in a bowl and pour over vegetables in the skillet.\n6. Cook on stovetop for 3-4 minutes until edges start to set.\n7. Transfer skillet to oven and bake for 10-12 minutes until eggs are fully set.\n8. Let cool slightly before slicing and serving."
    },
    {
      id: "2",
      name: "Turkey Avocado Wrap",
      images: {
        placeholder_emoji: "🌯",
      },
      description: "A healthy wrap with turkey and avocado.",
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
      instructions: "1. Lay the whole wheat wrap flat on a clean surface.\n2. Slice the avocado and arrange on the wrap.\n3. Layer turkey slices evenly on top of the avocado.\n4. Add lettuce leaves on top of the turkey.\n5. Fold in sides of the wrap, then roll tightly from bottom up.\n6. Cut in half diagonally and serve immediately."
    },
    {
      id: "3",
      name: "Lemon Herb Chicken",
      images: {
        placeholder_emoji: "🍗",
      },
      description: "Juicy chicken marinated in lemon and herbs.",
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
      instructions: "## Preparation\n1. Mince garlic cloves and zest the lemon.\n2. Juice the lemon and combine with olive oil and minced garlic in a container.\n3. Add chicken pieces to the marinade and coat thoroughly.\n4. Cover container and refrigerate for at least 30 minutes, preferably 2-4 hours.\n\n## Cooking\n1. Preheat grill to medium-high heat.\n2. Remove chicken from marinade and place on the grill.\n3. Cook for 6-7 minutes per side until internal temperature reaches 165°F (74°C).\n4. Let chicken rest for 5 minutes before serving."
    }
  ];

  export const mockupSupriseMeal: Meal = {
    id: "surprise",
    name: "Surprise Meal",
    description: "A surprise meal just for you!",
    images: {
      placeholder_emoji: "🍽️",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Surprise Ingredient 1", quantity: 1, unit: "g" },
        { id: "2", name: "Surprise Ingredient 2", quantity: 2, unit: "g" },
      ]
    },
    equipments: {
      equipments: [
        { id: "1", name: "Surprise Equipment 1", quantity: 1 },
        { id: "2", name: "Surprise Equipment 2", quantity: 1 },
      ]
    },
    instructions: "# Your Mystery Meal Adventure\n\n**Step 1:** Open your surprise ingredients package.\n\n**Step 2:** Follow the secret recipe card included in your package.\n\n**Step 3:** Prepare ingredients according to the instructions on the card.\n\n**Step 4:** Cook using the provided equipment following temperature and time guidelines.\n\n**Step 5:** Plate your creation and enjoy your surprise meal!"
  };