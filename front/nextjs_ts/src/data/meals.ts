import { Meal } from "@/types/meals";

export const mockupMeals: Meal[] = [
  {
    id: "1",
    name: "Quinoa Veggie Bowl",
    description: "A hearty bowl of quinoa and fresh veggies, perfect for vegans and gluten-free diets.",
    images: {
      placeholder_emoji: "🥗",
      hero_url: "https://meal-images.ams1.vultrobjects.com/Quinoa_Veggie_Bowl_53d13b2d-b7e3-4691-a66a-811849c7aff4.jpg",
    },
    videos: {
      hero_url: "https://meal-videos.ams1.vultrobjects.com/Quinoa_Veggie_Bowl_241e23d9-357a-42a2-81c5-bdebc6f75dc3.mp4",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Quinoa", quantity: 1, unit: "cup" },
        { id: "2", name: "Cherry Tomatoes", quantity: 1, unit: "cup" },
        { id: "3", name: "Cucumber", quantity: 1, unit: "pieces" },
        { id: "4", name: "Avocado", quantity: 1, unit: "pieces" },
        { id: "5", name: "Lemon Juice", quantity: 2, unit: "tablespoons" },
      ],
    },
    equipments: {
      equipments: [
        { id: "1", name: "Pot", quantity: 1 },
        { id: "2", name: "Knife", quantity: 1 },
        { id: "3", name: "Cutting Board", quantity: 1 },
      ],
    },
    instructions:
      "1. Rinse quinoa and cook according to package instructions.\n2. Dice cherry tomatoes, cucumber, and avocado.\n3. Combine cooked quinoa, diced veggies, and lemon juice in a bowl.\n4. Mix well and serve fresh.",
  },
  {
    id: "2",
    name: "Sweet Potato Tacos",
    description: "Delicious vegan and gluten-free tacos with roasted sweet potatoes.",
    images: {
      placeholder_emoji: "🌮",
      hero_url: "https://meal-images.ams1.vultrobjects.com/Sweet_Potato_Tacos_53629b63-19e1-4910-884e-cd3034b9c602.jpg",
    },
    videos: {
      hero_url: "https://meal-videos.ams1.vultrobjects.com/Sweet_Potato_Tacos_35ef5922-37c9-49b0-8fe1-bf2aca7224a6.mp4",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Sweet Potatoes", quantity: 2, unit: "pieces" },
        { id: "2", name: "Corn Tortillas", quantity: 4, unit: "pieces" },
        { id: "3", name: "Black Beans", quantity: 1, unit: "cup" },
        { id: "4", name: "Cilantro", quantity: 1, unit: "bunch" },
        { id: "5", name: "Lime", quantity: 1, unit: "pieces" },
      ],
    },
    equipments: {
      equipments: [
        { id: "1", name: "Oven", quantity: 1 },
        { id: "2", name: "Baking Sheet", quantity: 1 },
        { id: "3", name: "Knife", quantity: 1 },
      ],
    },
    instructions:
      "1. Preheat oven to 400°F (200°C).\n2. Peel and dice sweet potatoes, then roast on a baking sheet for 20-25 minutes.\n3. Warm corn tortillas in a skillet.\n4. Fill tortillas with roasted sweet potatoes, black beans, and chopped cilantro.\n5. Squeeze lime juice over tacos and serve.",
  },
  {
    id: "3",
    name: "Chickpea Salad",
    description: "A protein-packed vegan and gluten-free salad with chickpeas and fresh veggies.",
    images: {
      placeholder_emoji: "🥙",
      hero_url: "https://meal-images.ams1.vultrobjects.com/Chickpea_Salad_e26a0743-93d9-4632-98d8-2871ec05a828.jpg",
    },
    videos: {
      hero_url: "https://meal-videos.ams1.vultrobjects.com/Chickpea_Salad_19efa421-5965-4a28-b7ed-a7de47661636.mp4",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Chickpeas", quantity: 1, unit: "can" },
        { id: "2", name: "Red Bell Pepper", quantity: 1, unit: "pieces" },
        { id: "3", name: "Cucumber", quantity: 1, unit: "pieces" },
        { id: "4", name: "Olive Oil", quantity: 2, unit: "tablespoons" },
        { id: "5", name: "Parsley", quantity: 1, unit: "bunch" },
      ],
    },
    equipments: {
      equipments: [
        { id: "1", name: "Knife", quantity: 1 },
        { id: "2", name: "Cutting Board", quantity: 1 },
        { id: "3", name: "Mixing Bowl", quantity: 1 },
      ],
    },
    instructions:
      "1. Rinse and drain chickpeas.\n2. Dice red bell pepper and cucumber.\n3. Chop parsley finely.\n4. Combine chickpeas, diced veggies, and parsley in a mixing bowl.\n5. Drizzle with olive oil, mix well, and serve.",
  },
  {
    id: "4",
    name: "Zucchini Noodles",
    description: "A low-carb vegan and gluten-free dish made with spiralized zucchini.",
    images: {
      placeholder_emoji: "🍝",
      hero_url: "https://meal-images.ams1.vultrobjects.com/Zucchini_Noodles_cdf08385-40fc-44d2-95b2-d632d7b01712.jpg",
    },
    videos: {
      hero_url: "https://meal-videos.ams1.vultrobjects.com/Zucchini_Noodles_4813756a-363d-4648-b20c-1b5b93ceeb3e.mp4",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Zucchini", quantity: 2, unit: "pieces" },
        { id: "2", name: "Cherry Tomatoes", quantity: 1, unit: "cup" },
        { id: "3", name: "Basil", quantity: 1, unit: "bunch" },
        { id: "4", name: "Olive Oil", quantity: 2, unit: "tablespoons" },
        { id: "5", name: "Garlic", quantity: 2, unit: "cloves" },
      ],
    },
    equipments: {
      equipments: [
        { id: "1", name: "Spiralizer", quantity: 1 },
        { id: "2", name: "Skillet", quantity: 1 },
        { id: "3", name: "Knife", quantity: 1 },
      ],
    },
    instructions:
      "1. Spiralize zucchini into noodles.\n2. Mince garlic and halve cherry tomatoes.\n3. Heat olive oil in a skillet, add garlic and tomatoes, and sauté for 3-4 minutes.\n4. Add zucchini noodles to the skillet and cook for another 2-3 minutes.\n5. Garnish with fresh basil and serve.",
  },
  {
    id: "5",
    name: "Vegan Buddha Bowl",
    description: "A colorful and nutritious vegan and gluten-free bowl filled with grains and veggies.",
    images: {
      placeholder_emoji: "🍚",
      hero_url: "https://meal-images.ams1.vultrobjects.com/Vegan_Buddha_Bowl_21fe6842-d12a-4ede-9023-6237bd120295.jpg",
    },
    videos: {
      hero_url: "https://meal-videos.ams1.vultrobjects.com/Vegan_Buddha_Bowl_fe232b47-ac7f-44c8-9668-14483cd28031.mp4",
    },
    ingredients: {
      ingredients: [
        { id: "1", name: "Brown Rice", quantity: 1, unit: "cup" },
        { id: "2", name: "Broccoli", quantity: 1, unit: "cup" },
        { id: "3", name: "Carrots", quantity: 1, unit: "pieces" },
        { id: "4", name: "Tahini", quantity: 2, unit: "tablespoons" },
        { id: "5", name: "Sesame Seeds", quantity: 1, unit: "tablespoon" },
      ],
    },
    equipments: {
      equipments: [
        { id: "1", name: "Pot", quantity: 1 },
        { id: "2", name: "Steamer", quantity: 1 },
        { id: "3", name: "Bowl", quantity: 1 },
      ],
    },
    instructions:
      "1. Cook brown rice according to package instructions.\n2. Steam broccoli and slice carrots.\n3. In a bowl, combine cooked rice, steamed veggies, and tahini.\n4. Sprinkle sesame seeds on top and serve.",
  },  
];

export const mockupSupriseMeal: Meal = {
  id: "surprise",
  name: "Surprise Vegan Delight",
  description: "A surprise vegan and gluten-free meal just for you!",
  images: {
    placeholder_emoji: "🍽️",
    hero_url: "https://meal-images.ams1.vultrobjects.com/Chickpea_Salad_e8697213-ca58-4795-a1fd-58c5b54ca32c.jpg",
  },
  videos: {
    hero_url: "https://meal-videos.ams1.vultrobjects.com/Chickpea_Salad_19efa421-5965-4a28-b7ed-a7de47661636.mp4",
  },
  ingredients: {
    ingredients: [
      { id: "1", name: "Surprise Ingredient 1", quantity: 1, unit: "g" },
      { id: "2", name: "Surprise Ingredient 2", quantity: 2, unit: "g" },
    ],
  },
  equipments: {
    equipments: [
      { id: "1", name: "Surprise Equipment 1", quantity: 1 },
      { id: "2", name: "Surprise Equipment 2", quantity: 1 },
    ],
  },
  instructions:
    "# Your Mystery Vegan Adventure\n\n**Step 1:** Open your surprise ingredients package.\n\n**Step 2:** Follow the secret recipe card included in your package.\n\n**Step 3:** Prepare ingredients according to the instructions on the card.\n\n**Step 4:** Cook using the provided equipment following temperature and time guidelines.\n\n**Step 5:** Plate your creation and enjoy your surprise vegan meal!",
};