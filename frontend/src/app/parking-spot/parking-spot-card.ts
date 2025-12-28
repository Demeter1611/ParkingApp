import { Component, input } from "@angular/core";
import { ParkingSpot } from "../interfaces/parkingspot";

@Component({
  selector: 'app-parking-spot',
  template:`
    <section class="parking-spot occupied">
      <h2 class="parking-spot-name">{{ parkingSpot().name }}</h2>
      <span class="parking-spot-status"> Reserved </span>
      <span class="parking-spot-car"> HR 66 BRR</span>
    </section>
  `,
  styleUrls:['parking-spot-card.css'],
})
export class ParkingSpotCardComponent{
  parkingSpot = input.required<ParkingSpot>();
}
