import { Component, input } from "@angular/core";
import { ParkingSpot } from "../interfaces/parkingspot";

@Component({
  selector: 'app-parking-spot',
  template:`
    <section class="parking-spot" [class]="{'occupied': parkingSpot().status === 'locked' || parkingSpot().status === 'reserved', 'available' : parkingSpot().status === 'available'}">
      <h2 class="parking-spot-name">{{ parkingSpot().name }}</h2>
      <span class="parking-spot-status"> {{ parkingSpot().status }}</span>
      <span class="parking-spot-car"> {{ parkingSpot().occupantId ? parkingSpot().occupantCarplate : parkingSpot().ownerCarplate}}</span>
    </section>
  `,
  styleUrls:['parking-spot-card.css'],
})
export class ParkingSpotCardComponent{
  parkingSpot = input.required<ParkingSpot>();
}
