import { Component, inject } from "@angular/core";
import { TopbarService } from "../services/topbar-service";
import { TodayStatus } from "./today-status/today-status";
import { CommunityHub } from "./community-hub/community-hub";
import { ParkingLot } from "../interfaces/parkinglot";
import { ParkingLotService } from "../services/parking-lot-service";
import { ParkingSpot } from "../interfaces/parkingspot";
import { ParkingSpotService } from "../services/parking-spot-service";
import ReservationRequestForm from "./reservation-request-form/reservation-request-form";
import { Scheduler } from "./scheduler/scheduler";
import { MatIcon } from "@angular/material/icon";
import AvailableSpotsView from "./available-spots-view/available-spots-view";

@Component({
  selector: 'app-user-dashboard',
  template:`
  <section class="user-dashboard">
    <div class="left-card">
      <mat-icon class="calendar-icon" (click)="schedulerVisible = !schedulerVisible">calendar_today</mat-icon>
      @if(!schedulerVisible){
        <app-today-status
        [parkingSpot]="mySpot"
        (openAvailableSpots)="this.availableSpotsVisible = $event"
        />
      }
      @else {
        <app-scheduler
        [mySpot]="mySpot"
        (openMakeRequest)="handleOpenMakeRequest($event)"
        (openAvailableSpots)="handleOpenAvailableSpots($event)"
        (selectionCleared)="handleClearSelection()"/>
      }
    </div>
    @if(this.accessibleParkingLots.length > 0){
      @if(availableSpotsVisible && selectedDates){
        <app-available-spots-view
        [currentParkingLot]="this.selectedParkingLot"
        [searchInterval]="this.selectedDates"
        (selectionCleared)="handleClearSelection()"/>
      }@else {
        <app-community-hub
        [parkingLotId]="this.selectedParkingLot.id"
        [mySpot]="mySpot"/>
      }
    }
    @if(requestVisible && selectedDates){
      <app-reservation-request-form
      [currentParkingLot]="this.selectedParkingLot"
      [requestDates]="this.selectedDates"
      (modalVisible)="this.requestVisible = $event"/>
    }
  </section>
  `,
  styleUrls: ['user-dashboard.css'],
  imports: [TodayStatus, CommunityHub, ReservationRequestForm, Scheduler, MatIcon, AvailableSpotsView]
}) export class UserDashboard{
  topbarService = inject(TopbarService);
  parkingLotService = inject(ParkingLotService);
  parkingSpotService = inject(ParkingSpotService);
  availableSpotsVisible: boolean = false;
  schedulerVisible: boolean = false;
  requestVisible: boolean = false;
  selectedDates: {startDate: Date, endDate: Date} | null = null;


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

  handleOpenMakeRequest(dates: {startDate: Date, endDate: Date}) {
    this.selectedDates = dates;
    this.requestVisible = true;
  }

  handleOpenAvailableSpots(dates: {startDate: Date, endDate: Date}) {
    this.selectedDates = dates;
    this.availableSpotsVisible = true;
  }

  handleClearSelection(){
    this.selectedDates = null;
    this.requestVisible = false;
    this.availableSpotsVisible = false;
  }
}
