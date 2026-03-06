import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';
import { ParkingLotViewComponent } from './parking-lot-view/parking-lot-view';
import { DashboardWrapper } from './dashboard-wrapper/dashboard-wrapper';

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
    component: DashboardWrapper
  },
  {
    path: 'dashboard/:id/grid',
    component: ParkingLotViewComponent
  }
];
