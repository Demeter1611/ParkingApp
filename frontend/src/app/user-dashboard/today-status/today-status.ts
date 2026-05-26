import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, input, output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-today-status',
  template:`
    <div class="today-wrapper">

      @if(parkingSpot()){
        <div class="content-group">
          <h1 class="today-title">Today's Parking Spot</h1>

          <span class="status-badge" [class]="parkingSpot()?.status?.toLowerCase()">
            {{ parkingSpot()?.status }}
          </span>

          <div class="spot-display" [class.released]="parkingSpot()?.status === 'released'">
            <mat-icon class="car-icon">directions_car</mat-icon>
            <h2 class="spot-number">{{ parkingSpot()?.name }}</h2>
          </div>
        </div>

        <div class="action-buttons">
          @if(parkingSpot()?.status !== 'released') {
            <button class="today-card-button btn-outline">
              <mat-icon>no_crash</mat-icon> Release Spot
            </button>
          }
        </div>
      }
      @else {
        <div class="empty-state">
          <div class="icon-circle">
            <mat-icon class="empty-icon">event_busy</mat-icon>
          </div>
          <h1 class="today-title">No spot for today</h1>
          <p class="subtitle">Need a parking spot? Check the schedule and book one in advance.</p>
        </div>
      }

    </div>
  `,
  styleUrls: ['today-status.css'],
  imports: [MatIcon]
}) export class TodayStatus{
  parkingSpot = input.required<ParkingSpot | null>();
  openAvailableSpots = output<boolean>();
}
