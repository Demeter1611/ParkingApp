import { ParkingLot } from './../../../interfaces/parkinglot';
import { Component, input, output } from "@angular/core";

@Component({
  selector: 'app-parking-lot',
  template:`
    <section class="parking-lot-card" (click)="selectMe()">
      <div class="info">
        <span>{{ parkingLot().name }}</span>
        <span class="address">{{parkingLot().address }}</span>
      </div>
    </section>
  `,
  styleUrls:['parking-lot.css']
})
export default class ParkingLotComponent{
  parkingLot = input.required<ParkingLot>();
  parkingLotSelected = output<ParkingLot>();

  selectMe(){
    this.parkingLotSelected.emit(this.parkingLot());
  }
}
