import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store<fromAppReducer.AppState>) {}
  private tokenExpirationTimer: any;

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout())
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null
    }
  } 
}
