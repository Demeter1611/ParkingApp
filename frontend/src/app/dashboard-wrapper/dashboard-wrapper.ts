import { Component, inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication-service";
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard";
import { UserDashboard } from "../user-dashboard/user-dashboard";

@Component({
  selector: 'app-dashboard-wrapper',
  template:`
  @if(this.role === 'parking'){
    <app-admin-dashboard/>
  }
  @if(this.role === 'user'){
    <app-user-dashboard/>
  }
  `,
  imports: [AdminDashboardComponent, UserDashboard]
})
export class DashboardWrapper {
  authenticationService = inject(AuthenticationService);
  role = "";
  ngOnInit(){
    this.role = this.authenticationService.userRole;
  }
}
