import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth-guard';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'expense-tracker/dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'expense-tracker',
    loadComponent: () => import('./shared/components/side-nav/side-nav').then((m) => m.SideNav),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/pages/dashboard/dashboard').then((m) => m.Dashboard) },
    ],
  },
  // { path: '**', redirectTo: 'login' },
];
