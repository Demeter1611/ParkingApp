import { Component, input, output } from "@angular/core";
import { ParkingSpot } from "../../interfaces/parkingspot";

@Component({
  selector: 'app-parking-spot',
  template:`
    <div class="parking-spot" [class]="{unoccupied: parkingSpot().status === 'available', occupied: parkingSpot().status !=='available'}"
    (click)="selectMe()">
    <small class="parking-spot-name">{{parkingSpot().name}}</small>
    </div>
  `,
  styleUrls: ['parking-spot.css']
})
export class ParkingSpotComponent {
  parkingSpot = input.required<ParkingSpot>();
  parkingSpotSelected = output<ParkingSpot>();

  selectMe(){
    this.parkingSpotSelected.emit(this.parkingSpot());
  }
}
