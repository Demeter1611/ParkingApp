import { ParkingLotService } from './../services/parking-lot-service';
import { ParkingSpot } from './../interfaces/parkingspot';
import { Component, inject, input } from "@angular/core";
import { ParkingSpotService } from "../services/parking-spot-service";
import { ParkingSpotCardComponent } from "../parking-spot/parking-spot-card";
import { ParkingLot } from '../interfaces/parkinglot';

@Component({
  selector: 'app-parking-lot-view',
  template: `
    <section>
      @if(parkingSpots.length === 0){
        <h1>No parking spots available</h1>
      }
      @else{
        <div class="parking-map">
        @for(parkingSpot of parkingSpots; track parkingSpot.id){
            <app-parking-spot [parkingSpot] = "parkingSpot"/>
          }
        </div>
      }
    </section>
  `,
  styleUrl: 'parking-lot-view.css',
  imports: [ParkingSpotCardComponent]
})
export class ParkingLotViewComponent {
  parkingSpotService = inject(ParkingSpotService);
  parkingLotService = inject(ParkingLotService);
  parkingSpots: ParkingSpot[] = [];
  currentParkingLot = input.required<ParkingLot>();
  async ngOnInit(){
    const parkingLot = this.currentParkingLot();
    this.parkingSpots = await this.parkingLotService.getSpotsWithStatus(parkingLot.id);
    console.log(this.parkingSpots);
  }
}
