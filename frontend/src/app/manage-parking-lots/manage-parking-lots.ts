import { Component, inject } from "@angular/core";
import { ParkingLotService } from "../services/parking-lot-service";
import { ParkingLot } from "../interfaces/parkinglot";
import { ParkingLotFormComponent } from "../parking-lot-form/parking-lot-form";
import { ParkingLotCardComponent } from "../parking-lot-card/parking-lot-card";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-manage-parking-lots',
  template:`
    <section>
      <div class="middle-section">
        <button class="primary-button create" (click)="toggleCreate()">Create a new lot</button>
        <div class="parking-lot-list">
          @for(parkingLot of parkingLots; track parkingLot.id){
            <app-parking-lot-card
            [ngClass]="{'selected': selectedParkingLot === parkingLot}"
            [parkingLot]="parkingLot"
            (click)="toggleSelectParkingLot(parkingLot)"/>
          }
        </div>
      </div>
      @if(selectedParkingLot){
        <app-parking-lot-form [parkingLot]="selectedParkingLot"/>
      }
      @if(isCreateActive){
        <app-parking-lot-form/>
      }
    </section>
  `,
  styleUrls:['manage-parking-lots.css'],
  imports: [ParkingLotFormComponent, ParkingLotCardComponent, NgClass]
})
export class ManageParkingLotsComponent{
  parkingLotService = inject(ParkingLotService);
  parkingLots: ParkingLot[] = [];
  selectedParkingLot?: ParkingLot;
  isCreateActive = false;

  async ngOnInit(){
    this.parkingLots = await this.parkingLotService.getMine();
  }

  toggleSelectParkingLot(parkingLot: ParkingLot){
    if(this.selectedParkingLot === parkingLot){
      this.selectedParkingLot = undefined;
    }
    else{
      this.selectedParkingLot = parkingLot;
      this.isCreateActive = false;
    }
  }

  toggleCreate(){
    this.selectedParkingLot = undefined;
    this.isCreateActive = !this.isCreateActive;
  }
}
