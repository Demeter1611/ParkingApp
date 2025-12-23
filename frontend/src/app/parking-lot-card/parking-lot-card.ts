import { ParkingLot } from './../interfaces/parkinglot';
import { Component, input } from "@angular/core";

@Component({
  selector: 'app-parking-lot-card',
  template: `
  <section>
    <span class="name">{{ parkingLot().name }}</span>
    <span class="address">{{ parkingLot().address }}</span>
    <span class="subtext">Maximum capacity: {{ parkingLot().maxCapacity }}</span>
  </section>
  `,
  styleUrls: ['parking-lot-card.css']
})
export class ParkingLotCardComponent{
  parkingLot = input.required<ParkingLot>();
}
