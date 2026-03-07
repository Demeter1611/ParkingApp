import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, input, output } from "@angular/core";

@Component({
  selector: 'app-today-status',
  template:`
    <div class="today-card">
      @if(parkingSpot()){
        <h1 class="today-card-text">Today's parking spot</h1>
        <h2 class="parking-spot-number">{{parkingSpot()?.name}}</h2>
        <div class="action-buttons">
          <button class="today-card-button">View on Google Maps</button>
          @if(parkingSpot()?.status === 'allocated'){
            <button class="today-card-button">Free up spot</button>
          }
          @else{
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
}
