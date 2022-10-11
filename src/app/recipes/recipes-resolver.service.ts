import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromAppReducer from '../store/app.reducer';
import * as RecipesActions from './store/recipe.actions';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private recipeService: RecipeService,
    private store: Store<fromAppReducer.AppState>,
    private actions$: Actions
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipeService.getRecipes();
    // if (recipes.length === 0) {
    //     return this.dataStorageService.fetchRecipes()
    // } else {
    //     return recipes;
    // }
    return this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
