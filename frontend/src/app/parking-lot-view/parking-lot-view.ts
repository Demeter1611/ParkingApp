import { ParkingLot } from './../interfaces/parkinglot';
import { Component, inject, input } from "@angular/core";
import { ParkingLotGridComponent } from "./parking-lot-grid/parking-lot-grid";
import { ParkingSpot } from '../interfaces/parkingspot';
import ParkingSpotDetailsComponent from "./parking-spot-details/parking-spot-details";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parking-lot-view',
  template:`
  <section class="parking-lot-view">
    @if(parkingLotId){
      <app-parking-lot-grid class="hidden-scroll"
        [parkingLotId]="this.parkingLotId"
        (parkingSpotSelected)="handleSpotSelection($event)"/>
    }
    @if(selectedSpot){
      <app-parking-spot-details [parkingSpot]="selectedSpot"/>
    }
  </section>
  `,
  styleUrls: ['parking-lot-view.css'],
  imports: [ParkingLotGridComponent, ParkingSpotDetailsComponent]
})
export class ParkingLotViewComponent{
  route = inject(ActivatedRoute);

  parkingLotId: number | undefined;
  selectedSpot: ParkingSpot | null = null;

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.parkingLotId = +id;
    }
  }

  handleSpotSelection(spot: ParkingSpot){
    if(this.selectedSpot === spot){
      this.selectedSpot = null;
    }
    else{
      this.selectedSpot = spot;
    }
  }
}
