// ng generate guard core/auth/auth to create canActiveFn for authGuard
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  if (authService.isAuthenticated() || token) {
    authService.isAuthenticated.set(true);
    return true;
  }
 
  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  if (authService.isAuthenticated() || token) {
    authService.isAuthenticated.set(true);
    return router.createUrlTree(['/expense-tracker/dashboard']);
  }

  return true;
};
