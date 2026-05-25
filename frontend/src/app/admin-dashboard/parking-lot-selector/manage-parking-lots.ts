import { Component, inject } from "@angular/core";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingLot } from "../../interfaces/parkinglot";
import ParkingLotComponent from "./parking-lot/parking-lot";
import ParkingLotFormComponent from "../parking-lot-form/parking-lot-form";
import { MatIcon } from "@angular/material/icon";
import ManageEmployeesComponent from "../manage-employees/manage-employees";
import { LotDeleteConfirmationComponent } from "../lot-delete-confirmation/lot-delete-confirmation";
import ManageSpotsModalComponent from "../manage-spots/manage-spots";

@Component({
  selector: 'app-manage-parking-lots',
  template:`
  <section class="manage-parking-lots">
    <div class="parking-lot-list">
      @for(parkingLot of parkingLots; track parkingLot.id){
        <app-parking-lot [parkingLot]="parkingLot"
        (actionSelected)="handleActionSelected($event)"/>
      }
      <button class="add-lot-button" (click)="handleAddLot()">
        <mat-icon class="add-icon">add</mat-icon>
        <span>Add a new lot</span>
      </button>
    </div>
    @if(this.parkingLotFormVisible){
      <app-parking-lot-form
      [currentParkingLot]="selectedParkingLot"
      (modalVisible)="this.parkingLotFormVisible = $event"
      (refreshPage)="this.loadParkingLots()"/>
    }
    @if(this.manageEmployeesVisible && selectedParkingLot) {
      <app-manage-employees
      [currentParkingLot]="selectedParkingLot"
      (modalVisible)="closeManageEmployees()"/>
    }
    @if(this.deleteConfirmationVisible && selectedParkingLot){
      <app-lot-delete-confirmation
      [currentParkingLot]="selectedParkingLot"
      (modalVisible)="closeDelete()"/>
    }
    @if(this.manageSpotsVisible && selectedParkingLot){
      <app-manage-spots
      [currentParkingLot]="selectedParkingLot"
      (modalVisible)="closeManageSpots()"/>
    }
  </section>
  `,
  styleUrls:['manage-parking-lots.css'],
  imports: [ParkingLotComponent, ParkingLotFormComponent, MatIcon, ManageEmployeesComponent, LotDeleteConfirmationComponent, ManageSpotsModalComponent]
})
export default class ManageParkingLotsComponent{
  parkingLotService = inject(ParkingLotService);
  parkingLots: ParkingLot[] = [];
  selectedParkingLot: ParkingLot | null = null;
  parkingLotFormVisible = false;
  manageEmployeesVisible = false;
  manageSpotsVisible = false;
  deleteConfirmationVisible = false;

  async loadParkingLots(){
    this.parkingLots = await this.parkingLotService.getMine();
  }

  ngOnInit(){
    this.loadParkingLots();
  }

  handleActionSelected(selected: {action: string, lot: ParkingLot}){
    this.selectedParkingLot = selected.lot;
    switch(selected.action){
      case 'edit':
        this.parkingLotFormVisible = true;
        break;
      case 'manage-employees':
        this.manageEmployeesVisible = true;
        break;
      case 'manage-spots':
        this.manageSpotsVisible = true;
        break;
      case 'delete':
        this.deleteConfirmationVisible = true;
        break;
    }
  }

  closeDelete() {
    this.loadParkingLots();
    this.deleteConfirmationVisible = false;
  }
  closeManageSpots() {
    this.loadParkingLots();
    this.manageSpotsVisible = false;
  }

  closeManageEmployees() {
    this.loadParkingLots();
    this.manageEmployeesVisible = false;
  }

  handleAddLot(){
    this.selectedParkingLot = null;
    this.parkingLotFormVisible = true;
  }
}
