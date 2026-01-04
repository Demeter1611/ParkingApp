import { Component, inject, input, output } from "@angular/core";
import { ParkingSpot } from "../../interfaces/parkingspot";
import { ParkingLot } from "../../interfaces/parkinglot";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingSpotComponent } from "../parking-spot/parking-spot";

@Component({
  selector:'app-parking-lot-grid',
  template:`
  <section class="parking-lot-grid">
      @if(parkingSpots.length === 0){
        <h1>No parking spots found</h1>
      }
      @else{
        <section class="top-section">
          <div class="legend">
            <div class="legend-item">
              <span class="dot occupied"></span>
              Occupied
            </div>
            <div class="legend-item">
              <span class="dot unoccupied"></span>
              Unoccupied
            </div>
          </div>
          <button>Calendar</button>
        </section>
        <div class="parking-spots">
        @for(parkingSpot of parkingSpots; track parkingSpot.id){
          <app-parking-spot [parkingSpot]="parkingSpot"
            (parkingSpotSelected)="onSpotClicked($event)"/>
        }
        </div>
      }
  </section>
  `,
  styleUrls:['parking-lot-grid.css'],
  imports: [ParkingSpotComponent]
})
export class ParkingLotGridComponent{
  parkingSpots: ParkingSpot[] = [];
  currentParkingLot = input.required<ParkingLot>();
  parkingSpotSelected = output<ParkingSpot>();
  displayDate: Date = new Date();
  parkingLotService = inject(ParkingLotService);

  ngOnInit(){
    this.loadParkingLot();
  }

  onSpotClicked(spot: ParkingSpot){
    this.parkingSpotSelected.emit(spot);
  }

  async loadParkingLot(){
    const parkingLotId = this.currentParkingLot().id;
    this.displayDate.setHours(0, 0, 0, 0);
    console.log(this.displayDate);
    this.parkingSpots = await this.parkingLotService.getSpotsWithStatus(parkingLotId, this.displayDate);
  }
}
