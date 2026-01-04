import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    component: AuthenticationComponent
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  }
];
