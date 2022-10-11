import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService } from './auth.service';
import * as fromAppReducer from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromAppReducer.AppState>) {}
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSubscription: Subscription;
  private storeSubscription: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error)
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email: form.value.email, password: form.value.password }))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email: form.value.email, password: form.value.password }))
    }
    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear()
    const componentRef =  hostViewContainerRef.createComponent(alertComponentFactory)
    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe()
      hostViewContainerRef.clear()
    })
  }

  ngOnDestroy(): void {
    if(this.closeSubscription) {
      this.closeSubscription.unsubscribe()
    }
    if(this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }
}
