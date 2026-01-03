import { Component, inject, input } from "@angular/core";
import { User } from "../interfaces/user";
import { ParkingLotService } from "../services/parking-lot-service";
import { ParkingLot } from "../interfaces/parkinglot";

@Component({
  selector: 'app-employee-card',
  template: `
    <section class="employee-card">
      <span class="title">{{this.employee().username}} - {{this.employee().carplate}} </span>
      <small class="email">{{ this.employee().email }}</small>
      <button class="revoke-button" (click)="handleRevoke()">Revoke access</button>
    </section>
  `,
  styleUrls: ['employee-card.css']
})
export class EmployeeCardComponent{
  employee = input.required<User>();
  currentParkingLot = input.required<ParkingLot>();
  parkingLotService = inject(ParkingLotService);

  async handleRevoke(){
    await this.parkingLotService.removeEmployee(this.currentParkingLot().id, this.employee().id);
  }
}
