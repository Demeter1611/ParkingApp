import { ParkingLot } from './../interfaces/parkinglot';
import { Component, input } from "@angular/core";
import { ParkingLotGridComponent } from "./parking-lot-grid/parking-lot-grid";
import { ParkingSpot } from '../interfaces/parkingspot';
import ParkingSpotDetailsComponent from "./parking-spot-details/parking-spot-details";

@Component({
  selector: 'app-parking-lot-view',
  template:`
  <section class="parking-lot-view">
    <app-parking-lot-grid [currentParkingLot]="currentParkingLot()" class="hidden-scroll"
      (parkingSpotSelected)="handleSpotSelection($event)"/>
    @if(selectedSpot){
      <app-parking-spot-details [parkingSpot]="selectedSpot"/>
    }
  </section>
  `,
  styleUrls: ['parking-lot-view.css'],
  imports: [ParkingLotGridComponent, ParkingSpotDetailsComponent]
})
export class ParkingLotViewComponent{
  currentParkingLot = input.required<ParkingLot>();
  selectedSpot: ParkingSpot | null = null;

  handleSpotSelection(spot: ParkingSpot){
    this.selectedSpot = spot;
  }

  mockParkingSpot: ParkingSpot = {
    id: 7,
    name:'A-000',
    occupantId: null,
    occupantUsername: null,
    occupantCarplate: null,
    ownerId: 4,
    ownerUsername: 'utilizator',
    ownerCarplate: 'HR 33 ABC',
    status: 'locked',
    windowId: null,
  }
}
