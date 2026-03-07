import { Component, inject } from "@angular/core";
import { TopbarService } from "../services/topbar-service";
import { TodayStatus } from "./today-status/today-status";
import { CommunityHub } from "./community-hub/community-hub";
import { ParkingLot } from "../interfaces/parkinglot";
import { ParkingLotService } from "../services/parking-lot-service";
import { ParkingSpot } from "../interfaces/parkingspot";
import { ParkingSpotService } from "../services/parking-spot-service";
import ReservationRequestForm from "./reservation-request-form/reservation-request-form";

@Component({
  selector: 'app-user-dashboard',
  template:`
  <section class="user-dashboard">
    <app-today-status
    [parkingSpot]="mySpot"
    (openMakeRequest)="this.makeRequestVisible = $event"
    (openAvailableSpots)="this.availableSpotsVisible = $event"/>
    @if(this.accessibleParkingLots.length > 0){
      <app-community-hub
      [parkingLotId]="this.selectedParkingLot.id"/>
    }
    @if(makeRequestVisible){
      <app-reservation-request-form
      [currentParkingLot]="this.selectedParkingLot"
      (modalVisible)="this.makeRequestVisible = $event"/>
    }
  </section>
  `,
  styleUrls: ['user-dashboard.css'],
  imports: [TodayStatus, CommunityHub, ReservationRequestForm]
}) export class UserDashboard{
  topbarService = inject(TopbarService);
  parkingLotService = inject(ParkingLotService);
  parkingSpotService = inject(ParkingSpotService);
  availableSpotsVisible: boolean = false;
  makeRequestVisible: boolean = false;

  mySpot: ParkingSpot | null = null;
  accessibleParkingLots: ParkingLot[] = [];
  selectedParkingLot!: ParkingLot;

  async ngOnInit(){
    this.topbarService.updateTopbar({showTopbar: true, title: "User Dashboard"})
    this.accessibleParkingLots = await this.parkingLotService.getAccessibleParkingLots();
    this.selectedParkingLot = this.accessibleParkingLots[0];

    const today = new Date();
    this.mySpot = await this.parkingSpotService.getMine(today);
  }
}
