import { Component, inject, input } from "@angular/core";
import { ReservationRequestService } from "../../services/reservation-request-service";
import { ReservationRequest } from "../../interfaces/reservationrequest";
import { ReservationRequestCard } from "./reservation-request/reservation-request-card";
import { ParkingSpot } from "../../interfaces/parkingspot";

@Component({
  selector: 'app-community-hub',
  template:`
  <section class="community-hub hidden-scroll">
    <H1 class="card-title">Community Hub</H1>
    @for(reservationRequest of reservationRequests; track $index){
      <div class="reservation-list">
        <app-reservation-request-card
        [currentRequest]="reservationRequest"
        [mySpot]="mySpot()"/>
      </div>
    }
  </section>
  `,
  styleUrls: ['community-hub.css'],
  imports: [ReservationRequestCard]
}) export class CommunityHub {
  parkingLotId = input.required<number>();
  reservationRequestService = inject(ReservationRequestService);
  reservationRequests: ReservationRequest[] = [];
  mySpot = input<ParkingSpot | null>();

  async ngOnInit(){
    this.reservationRequests = await this.reservationRequestService.getPendingRequests(this.parkingLotId());
  }
}
