import { Component, inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication-service";
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard";

@Component({
  selector: 'app-dashboard-wrapper',
  template:`
  @if(this.role === 'parking'){
    <app-admin-dashboard/>
  }
  @if(this.role === 'employee'){

  }
  `,
  imports: [AdminDashboardComponent]
})
export class DashboardWrapper {
  authenticationService = inject(AuthenticationService);
  role = "";
  ngOnInit(){
    this.role = this.authenticationService.userRole;
  }
}
