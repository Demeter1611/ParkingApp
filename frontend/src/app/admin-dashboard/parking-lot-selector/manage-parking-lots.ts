import { Component, inject } from "@angular/core";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingLot } from "../../interfaces/parkinglot";
import ParkingLotComponent from "./parking-lot/parking-lot";
import ParkingLotDetails from "./parking-lot-details/parking-lot-details";

@Component({
  selector: 'app-manage-parking-lots',
  template:`
  <section class="manage-parking-lots">
    @if(!parkingLots.length){
      <h1 class="empty-list-text">
        Currently there are no parking lots available!
      </h1>
    }
    @else{
      <div class="parking-lot-list">
        @for(parkingLot of parkingLots; track parkingLot.id){
          <app-parking-lot [parkingLot]="parkingLot"
            (parkingLotSelected)="handleLotSelection($event)"/>
        }
        <button class="add-lot-button">Add a new lot</button>
      </div>
    }
    <div class="right-side-tab">
      @if(this.rightSideTab === "Details" && this.selectedParkingLot){
        <app-parking-lot-details [parkingLot]="selectedParkingLot"/>
      }
      @else if(this.rightSideTab === "CreateLot"){

      }
    </div>
  </section>
  `,
  styleUrls:['manage-parking-lots.css'],
  imports: [ParkingLotComponent, ParkingLotDetails]
})
export default class ManageParkingLotsComponent{
  parkingLotService = inject(ParkingLotService);
  parkingLots: ParkingLot[] = [];
  selectedParkingLot: ParkingLot | null = null;
  rightSideTab = "";

  async loadParkingLots(){
    this.parkingLots = await this.parkingLotService.getMine();
  }

  handleLotSelection(lot: ParkingLot){
    if(this.selectedParkingLot === lot){
      this.selectedParkingLot = null;
      this.rightSideTab = "";
    }
    else{
      this.selectedParkingLot = lot;
      this.rightSideTab = "Details";
    }
  }

  openLotCreationForm(){
    this.rightSideTab = "CreateLot";
  }

  ngOnInit(){
    this.loadParkingLots();
  }
}
