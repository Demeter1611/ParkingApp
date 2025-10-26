import { Component, ViewEncapsulation } from '@angular/core';
import { NavSidebar } from "../nav-sidebar/nav-sidebar";
import { CreateParkingLotComponent } from "../create-parking-lot/create-parking-lot";

@Component({
  selector: 'app-dashboard',
  imports: [NavSidebar, CreateParkingLotComponent],
  template: `
    <app-nav-sidebar/>
    <div class="main-content">
      <app-create-parking-lot/>
    </div>
  `,
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
}
