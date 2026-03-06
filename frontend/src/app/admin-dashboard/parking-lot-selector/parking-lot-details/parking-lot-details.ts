import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../../interfaces/parkinglot";
import InviteUserComponent from "../invite-user/invite-user";
import ParkingLotFormComponent from "../parking-lot-form/parking-lot-form";
import { Router } from "@angular/router";

@Component({
  selector:'app-parking-lot-details',
  template:`
    <section class="parking-lot-details">
      <div class="title">
        <span class="lot-name">{{parkingLot().name}}</span>
        <span class="lot-address">{{parkingLot().address}}</span>
      </div>
      <div class="actions">
        <div class="navigation">
          <button (click)="navigateTo('map')">View map</button>
          <button (click)="navigateTo('stats')">Statistics</button>
        </div>
        <div class="management">
          <button (click)="showInvite()">Invite / View Employees</button>
          <button (click)="showParkingLotForm()">Edit details</button>
        </div>
      </div>
      @if(this.inviteVisible){
        <app-invite-user [currentParkingLot]="this.parkingLot()"
        (modalVisible)="this.inviteVisible = $event"/>
      }
      @if(this.parkingLotFormVisible){
        <app-parking-lot-form [currentParkingLot]="this.parkingLot()"
        (modalVisible)="this.parkingLotFormVisible = $event"
        (refreshPage)="this.refreshPage.emit($event)"/>
      }
    </section>
  `,
  styleUrls:['parking-lot-details.css'],
  imports: [InviteUserComponent, ParkingLotFormComponent]
})
export default class ParkingLotDetails{
  private router = inject(Router);
  parkingLot = input.required<ParkingLot>();
  inviteVisible = false;
  parkingLotFormVisible = false;
  refreshPage = output<boolean>();

  showInvite() {
    this.inviteVisible = true;
  }

  showParkingLotForm() {
    this.parkingLotFormVisible = true;
  }

  navigateTo(page: string){
    if(page === 'map'){
      this.router.navigate(['/dashboard', this.parkingLot().id, 'grid']);
    }
  }
}
