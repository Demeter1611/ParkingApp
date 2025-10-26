import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';
import { DashboardComponent } from './dashboard/dashboard';

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
    component: DashboardComponent
  }
];
