import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
import * as fromAppReducer from '../store/app.reducer'

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>()


    constructor(private store: Store<fromAppReducer.AppState>) {}

    // private recipes: Recipe[] = [
    //     new Recipe('Small Samosa', 'This is small samosa recipe', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg', [
    //         new Ingredient('Samosa', 1),
    //         new Ingredient('Sauce', 1)
    //     ]),
    //     new Recipe('Big Samosa', 'This is big samosa recipe', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg', [
    //         new Ingredient('Samosa', 2),
    //         new Ingredient('Sauce', 2)
    //     ])
    // ];
    private recipes: Recipe[] = [];

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index]
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe
        this.recipesChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1)
        this.recipesChanged.next(this.recipes.slice())
    }
}