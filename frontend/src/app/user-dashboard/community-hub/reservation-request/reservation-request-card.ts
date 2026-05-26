import { Component, inject, input, output } from "@angular/core";
import { ReservationRequest } from "../../../interfaces/reservationrequest";
import { DatePipe } from "@angular/common";
import { ReservationRequestService } from "../../../services/reservation-request-service";
import { ParkingSpot } from "../../../interfaces/parkingspot";

@Component({
  selector: 'app-reservation-request-card',
  imports: [DatePipe],
  template: `
    <section class="reservation-request-card">
      <div class="details">
        <span class="reason">{{this.currentRequest().reason}}</span>
        <span class="user">Username: {{this.currentRequest().username}}</span>
        <span class="date">{{this.currentRequest().startDate | date: 'MMM d'}} - {{this.currentRequest().endDate | date: 'MMM d'}}</span>
      </div>
      @if(mySpot() && mySpot()?.status !== 'reserved'){
        <button (click)="onFulfill()">Fulfill request</button>
      }
    </section>
  `,
  styleUrls: ['reservation-request-card.css']
}) export class ReservationRequestCard {
  reservationRequestService = inject(ReservationRequestService);
  currentRequest = input.required<ReservationRequest>();
  refreshReservations = output<void>();
  mySpot = input<ParkingSpot | null>();

  async onFulfill(){
    const spot = this.mySpot();
    if(spot){
      await this.reservationRequestService.fulfillRequest(this.currentRequest().id, {spotId: spot.id});
    }
    this.refreshReservations.emit();
  }
}
