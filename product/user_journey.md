
# Search, Select, and Follow Recipe

## Dependency
* [required] user account
* [optional] user's preferences: diet, budget
* [optional] user's ingredients: Array<(item,quantity,unit_of_measure)>
* [optional] user's equipment: Array<(item,quantity,unit_of_measure)>
* [optional] user's favourite recipes: Array<(item,quantity,unit_of_measure)>

## Steps

1. User clicks on 'Recommend Recipe' button.
2. System initiates two requests in paralel
  2.1. query existing recipes
  2.2. LLM generate recipe titles
4. System displays recipe titles
5. Systems runs validation on ingredient and equipment availability
  4.1 If ingredient/equipment missing then suggest "Shopping"
6. User selects one recipe
7. System identifies source of recipe (datastore or LLM) and request source for details
8. System displays instructions and multimedia
9. [Optional] User provides feedback
