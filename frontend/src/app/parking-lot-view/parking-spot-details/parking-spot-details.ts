import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, input } from "@angular/core";

@Component({
  selector:'app-parking-spot-details',
  template:`
  <section class="parking-spot-details">
    <h1 class="parking-name">{{parkingSpot().name}}</h1>

    <div class="user-details">
      <h2 class="section-header">Owned by:</h2>
      <p><span class="bold">NAME: </span>{{parkingSpot().ownerUsername}} <br/>
        <span class="bold">CARPLATE: </span>{{parkingSpot().ownerCarplate}}</p>
    </div>

    @if(parkingSpot().status === 'occupied'){
      <div class="user-details">
        <div class="section-header">Reserved by:</div>
        <p><span class="bold">NAME: </span>{{parkingSpot().occupantUsername}} <br/>
      <span class="bold">CARPLATE: </span>{{parkingSpot().occupantCarplate}}</p>
      </div>
    }
  </section>
  `,
  styleUrls:['parking-spot-details.css']
})
export default class ParkingSpotDetailsComponent{
  parkingSpot = input.required<ParkingSpot>();
}
