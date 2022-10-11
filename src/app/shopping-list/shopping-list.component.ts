import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions'
import * as fromAppReducer from '../store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}> ;
  private subscription: Subscription;

  constructor(private store: Store<fromAppReducer.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }

}
