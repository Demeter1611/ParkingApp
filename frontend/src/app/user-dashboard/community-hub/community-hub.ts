import { Component, inject, input } from "@angular/core";
import { ReservationRequestService } from "../../services/reservation-request-service";
import { ReservationRequest } from "../../interfaces/reservationrequest";
import { ReservationRequestCard } from "./reservation-request/reservation-request-card";
import { ParkingSpot } from "../../interfaces/parkingspot";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-community-hub',
  template:`
  <section class="community-hub hidden-scroll">
    <h1 class="card-title">Community Hub</h1>

    @if(reservationRequests.length > 0) {
      <div class="reservation-list">
        @for(reservationRequest of reservationRequests; track $index){
          <app-reservation-request-card
          [currentRequest]="reservationRequest"
          [mySpot]="mySpot()"
          (refreshReservations)="loadReservations()"/>
        }
      </div>
    } @else {
      <div class="empty-state">
        <div class="icon-circle">
          <mat-icon class="empty-icon">inbox</mat-icon>
        </div>
        <h2 class="empty-title">All caught up!</h2>
        <p class="empty-subtitle">There are no pending parking requests from the community right now.</p>
      </div>
    }
  </section>
  `,
  styleUrls: ['community-hub.css'],
  imports: [ReservationRequestCard, MatIcon]
}) export class CommunityHub {
  parkingLotId = input.required<number>();
  reservationRequestService = inject(ReservationRequestService);
  reservationRequests: ReservationRequest[] = [];
  mySpot = input<ParkingSpot | null>();

  async loadReservations() {
    this.reservationRequests = await this.reservationRequestService.getPendingRequests(this.parkingLotId());
  }

  async ngOnInit(){
    this.loadReservations();
  }
}
