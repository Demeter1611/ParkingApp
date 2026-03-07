import { Component, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";

@Component({
  selector: 'app-available-spots-view',
  template:`
    <section class="available-spots-view modal">
      <button class="close-modal-button" (click)="closeModal()">X</button>

    </section>
  `,
  styleUrls: ['available-spots-view.css']
})
export default class AvailableSpotsView{
  modalVisible = output<boolean>();
  currentParkingLot = input.required<ParkingLot>();
  selectedDate = input.required<Date>();


  closeModal(){
    this.modalVisible.emit(false);
  }
}
