import { Component, input } from "@angular/core";
import { ParkingLot } from "../../../interfaces/parkinglot";

@Component({
  selector:'app-parking-lot-details',
  template:`
    <section class="parking-lot-details">
      <div class="title">
        <span class="lot-name">{{parkingLot().name}}</span>
        <span class="lot-address">{{parkingLot().address}}</span>
      </div>
      <div class="actions">
        <div class="navigation">
          <button>View map</button>
          <button>Statistics</button>
        </div>
        <div class="management">
          <button>Invite</button>
          <button>Edit/delete</button>
        </div>
      </div>
    </section>
  `,
  styleUrls:['parking-lot-details.css']
})
export default class ParkingLotDetails{
  parkingLot = input.required<ParkingLot>();
}
