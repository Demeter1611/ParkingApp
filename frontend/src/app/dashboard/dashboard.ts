import { Component, ViewEncapsulation } from '@angular/core';
import { NavSidebar } from "../nav-sidebar/nav-sidebar";
import { ManageParkingLotsComponent } from "../manage-parking-lots/manage-parking-lots";

@Component({
  selector: 'app-dashboard',
  imports: [NavSidebar, ManageParkingLotsComponent],
  template: `
    <app-nav-sidebar/>
    <div class="main-content">
      <app-manage-parking-lots/>
    </div>
  `,
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

}
