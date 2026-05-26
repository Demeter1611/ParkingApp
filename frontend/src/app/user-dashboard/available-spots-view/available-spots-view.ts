import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { ParkingLotService } from "../../services/parking-lot-service";
import { DatePipe } from "@angular/common";
import { AuthenticationService } from "../../services/authentication-service";
import { ReservationService } from "../../services/reservation-service";
import { MatIcon } from "@angular/material/icon";

export interface AvailablePeriod {
    startDate: string;
    endDate: string;
}

export interface AvailableSpot {
    spotId: number;
    spotName: string;
    availablePeriods: AvailablePeriod[];
}

@Component({
  selector: 'app-available-spots-view',
  template:`
    <section class="available-spots-view">
      <h1>Available spots</h1>

      @if(availableSpots.length > 0) {
        <div class="spot-list">
          @for(spot of availableSpots; track $index){
            <div class="spot">
              <div class="spot-info">
                <span class="spot-name">{{spot.spotName}}</span>
                @for(availablePeriod of spot.availablePeriods; track $index){
                  <span class="period">{{availablePeriod.startDate | date: 'MMM d'}} - {{availablePeriod.endDate | date : 'MMM d, yyyy'}}</span>
                }
              </div>
              <button class="primary-button reserve-btn" (click)="makeReservation(spot.spotId)">Reserve spot</button>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <div class="icon-circle">
            <mat-icon class="empty-icon">search_off</mat-icon>
          </div>
          <h2 class="empty-title">No spots found</h2>
          <p class="empty-subtitle">There are no available spots for the selected dates. Try checking another interval.</p>
        </div>
      }
    </section>
  `,
  styleUrls: ['available-spots-view.css'],
  imports: [DatePipe, MatIcon]
})
export default class AvailableSpotsView{
  currentParkingLot = input.required<ParkingLot>();
  selectionCleared = output<void>();
  parkingLotService = inject(ParkingLotService);
  reservationService = inject(ReservationService);
  authService = inject(AuthenticationService);
  searchInterval = input.required<{startDate: Date, endDate: Date}>();
  availableSpots: AvailableSpot[] = [];

  async ngOnInit() {
    this.availableSpots = await this.parkingLotService.getAllAvailableSpots(this.currentParkingLot().id, this.searchInterval().startDate, this.searchInterval().endDate);
  }

  async makeReservation(spotId: number){
    const currentUserId = await this.authService.id;
    const reservationData = {
      spotId: spotId,
      userId: currentUserId,
      startDate: this.searchInterval().startDate,
      endDate: this.searchInterval().endDate
    };

    try {
      const response = await this.reservationService.createReservation(reservationData);
      if (response && !response.error) {
        this.selectionCleared.emit();
      }
    } catch (err) {
      console.error(err);
    }
  }
}
