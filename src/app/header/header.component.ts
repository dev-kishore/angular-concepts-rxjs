import { Component, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import * as fromAppReducer from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesAction from '../recipes/store/recipe.actions'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    private userSubscription: Subscription;
    isAuthenticated = false

    constructor(private authService: AuthService, private store: Store<fromAppReducer.AppState>){}

    ngOnInit(): void {
        this.userSubscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
            this.isAuthenticated = !!user;
            console.log(!user);
            console.log(!!user);
        })
    }

    onSaveData() {
        this.store.dispatch(new RecipesAction.StoreRecipes())
    }

    onFetchData() {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipesAction.FetchRecipes())
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout())
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}