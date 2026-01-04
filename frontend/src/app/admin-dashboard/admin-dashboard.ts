import { Component, ViewEncapsulation } from "@angular/core";
import { ParkingLotViewComponent } from "../parking-lot-view/parking-lot-view";
import { ParkingLot } from "../interfaces/parkinglot";

@Component({
  selector: 'app-admin-dashboard',
  template:`
  <section class="admin-dashboard">
    <section class="top-section">
      <div class="navigation">
        <h1 class="current-page">Parking Lot View</h1>
        <h3 class="navigation-crumbs">Dashboard > Parking Lot View</h3>
      </div>
    </section>
    <app-parking-lot-view [currentParkingLot]="mockParkingSpot"/>
    <div class="bottom-spacing"></div>
  </section>
  `,
  styleUrls: ['admin-dashboard.css'],
  imports: [ParkingLotViewComponent]
})
export class AdminDashboardComponent {
  mockParkingSpot: ParkingLot = {
    id: 13,
    name: 'parcarenoua',
    address: 'toplita',
    maxCapacity: 250,
    timeslotsEnabled: true,
    sharingEnabled: true,
    temporaryOnlyEnabled: true,
    visitorSpotsEnabled: true,
    simplifiedGridEnabled: true,
    userId: 3
  }
}
