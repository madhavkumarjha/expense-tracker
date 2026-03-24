import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SideNav } from './shared/components/side-nav/side-nav';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
    {path:'login',component:Login},
    {
        path:'expense-tracker',
        component:SideNav,
        canActivate:[authGuard],
        children:[
            {path:'dashboard',component:Dashboard},
        ]

    }
];
