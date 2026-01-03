import { Component, ViewEncapsulation } from '@angular/core';
import { NavSidebar } from "../nav-sidebar/nav-sidebar";
import { ManageParkingLotsComponent } from "../manage-parking-lots/manage-parking-lots";
import { ParkingLot } from '../interfaces/parkinglot';
import { ParkingLotViewComponent } from "../parking-lot-view/parking-lot-view";
import { ManageEmployeesComponent } from "../manage-employees/manage-employees";

@Component({
  selector: 'app-dashboard',
  imports: [NavSidebar, ManageParkingLotsComponent, ParkingLotViewComponent, ManageEmployeesComponent],
  template: `
    <section class="dashboard">
      <div class="sidebar">
        <app-nav-sidebar/>
      </div>
      <main class="hidden-scroll">
        <!-- <app-parking-lot-view [currentParkingLot]="mockParkingLot"/> -->
        <app-manage-employees [currentParkingLot]="mockParkingLot"/>
      </main>
    </section>
`,
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
    mockParkingLot : ParkingLot = {
        "id": 13,
        "name": "parcarenoua",
        "address": "toplita",
        "maxCapacity": 250,
        "timeslotsEnabled": true,
        "sharingEnabled": true,
        "temporaryOnlyEnabled": true,
        "visitorSpotsEnabled": true,
        "simplifiedGridEnabled": false,
        "userId": 3
    }
}
