import { Component, inject, input } from "@angular/core";
import { ReservationRequest } from "../../../interfaces/reservationrequest";
import { DatePipe } from "@angular/common";
import { ReservationRequestService } from "../../../services/reservation-request-service";

@Component({
  selector: 'app-reservation-request-card',
  imports: [DatePipe],
  template: `
    <section class="reservation-request-card">
      <div class="details">
        <span class="reason">{{this.currentRequest().reason}}</span>
        <span class="user">Username: {{this.currentRequest().username}}</span>
        <span class="date">Date: {{this.currentRequest().requestedDate | date: 'yyyy-MM-dd'}}</span>
      </div>
      <button>Fulfill request</button>
    </section>
  `,
  styleUrls: ['reservation-request-card.css']
}) export class ReservationRequestCard {
  reservationRequestService = inject(ReservationRequestService);
  currentRequest = input.required<ReservationRequest>();
}
