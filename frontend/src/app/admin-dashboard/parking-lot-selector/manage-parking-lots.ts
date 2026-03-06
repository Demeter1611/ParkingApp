import { Component, inject } from "@angular/core";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingLot } from "../../interfaces/parkinglot";
import ParkingLotComponent from "./parking-lot/parking-lot";
import ParkingLotDetails from "./parking-lot-details/parking-lot-details";
import ParkingLotFormComponent from "./parking-lot-form/parking-lot-form";

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
        <button class="add-lot-button" (click)="showParkingLotForm()">Add a new lot</button>
      </div>
    }
    <div class="right-side-tab">
      @if(this.rightSideTab === "Details" && this.selectedParkingLot){
        <app-parking-lot-details [parkingLot]="selectedParkingLot"
        (refreshPage)="this.handleRefresh()"/>
      }
    </div>
    @if(this.parkingLotFormVisible){
      <app-parking-lot-form
      (modalVisible)="this.parkingLotFormVisible = $event"
      (refreshPage)="this.handleRefresh()"/>
    }
  </section>
  `,
  styleUrls:['manage-parking-lots.css'],
  imports: [ParkingLotComponent, ParkingLotDetails, ParkingLotFormComponent]
})
export default class ManageParkingLotsComponent{
  parkingLotService = inject(ParkingLotService);
  parkingLots: ParkingLot[] = [];
  selectedParkingLot: ParkingLot | null = null;
  rightSideTab = "";
  parkingLotFormVisible = false;

  async loadParkingLots(){
    this.parkingLots = await this.parkingLotService.getMine();
  }

  async handleRefresh(){
    await this.loadParkingLots();
    const stillExists = this.parkingLots.find(p => p.id === this.selectedParkingLot?.id);

    if(!stillExists){
      this.rightSideTab="";
      this.selectedParkingLot = null;
    }
    else{
      this.selectedParkingLot = stillExists;
    }
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

  showParkingLotForm(){
    this.parkingLotFormVisible = true;
  }

  ngOnInit(){
    this.loadParkingLots();
  }
}
