from src.models.ingredients import Ingredient
from src.models.meals import Meal, MealPreview


async def meal_detailer(
    meal_preview: MealPreview,
) -> Meal:
    """Detail a meal."""
    name = meal_preview.name
    description = meal_preview.description
    placeholder_emoji = meal_preview.images.placeholder_emoji

    meal = Meal(
        id=meal_preview.id,
        name=name,
        description=description,
        images=meal_preview.images,
        ingredients=[],
    )
    save_meal(meal=meal)

    ingredients: list[Ingredient] = get_ingredients(
        name=name,
        description=description,
        placeholder_emoji=placeholder_emoji,
    )


def get_ingredients(
    name: str,
    description: str,
    placeholder_emoji: str,
) -> list[Ingredient]:
    """Get ingredients for a meal."""
    return [
        Ingredient(
            name="apple",
            quantity=1,
            unit="piece",
        ),
    ]

def save_meal(
    meal: Meal,
) -> None:
    """Save a meal."""
    pass