import { Component, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-available-spots-view',
  template:`
    <section class="available-spots-view modal">
      <button class="close-modal-button" (click)="closeModal()"><mat-icon>close</mat-icon></button>

    </section>
  `,
  styleUrls: ['available-spots-view.css'],
  imports: [MatIcon]
})
export default class AvailableSpotsView{
  modalVisible = output<boolean>();
  currentParkingLot = input.required<ParkingLot>();
  selectedDate = input.required<Date>();


  closeModal(){
    this.modalVisible.emit(false);
  }
}
