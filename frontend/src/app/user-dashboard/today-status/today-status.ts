import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, input, output } from "@angular/core";

@Component({
  selector: 'app-today-status',
  template:`
    <div class="today-card">
      @if(parkingSpot()){
        <h1 class="today-card-text">Today's parking spot</h1>
        <small class="status-display">{{parkingSpot()?.status?.toUpperCase()}}</small>
        <h2 class="parking-spot-number" [class.released]="parkingSpot()?.status === 'released'">{{parkingSpot()?.name}}</h2>
        <div class="action-buttons">
          <button class="today-card-button">View on Google Maps</button>
          @if(parkingSpot()?.status === 'allocated'){
            <button class="today-card-button" (click)="openFreeUpSpot.emit(true)">Free up spot</button>
          }
          @else if(parkingSpot()?.status !== 'released'){
            <button class="today-card-button" (click)="openMakeRequest.emit(true)">Make future request</button>
          }
        </div>
      }
      @else {
        <h1 class="today-card-text">You've got no parking spot for today</h1>
        <div class="action-buttons">
          <button class="today-card-button" (click)="openAvailableSpots.emit(true)">View available spots</button>
          <button class="today-card-button" (click)="openMakeRequest.emit(true)">Make future request</button>
        </div>
      }
    </div>
  `,
  styleUrls: ['today-status.css']
}) export class TodayStatus{
  parkingSpot = input.required<ParkingSpot | null>();
  openMakeRequest = output<boolean>();
  openAvailableSpots = output<boolean>();
  openFreeUpSpot = output<boolean>();
}
