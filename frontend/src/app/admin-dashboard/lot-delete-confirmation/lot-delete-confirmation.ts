import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { MatIcon } from "@angular/material/icon";
import { ParkingLotService } from "../../services/parking-lot-service";

@Component({
  selector:'app-lot-delete-confirmation',
  template: `
    <section class="modal ">
      <button class="close-modal-button" (click)="closeModal()"><mat-icon>close</mat-icon></button>
      <div class="modal-content delete-confirmation">
        <h2 class="delete-title">Delete Parking Lot</h2>
        <p class="delete-message">
          Are you sure you want to delete <strong>{{ currentParkingLot().name }}</strong>?
          <br>This action cannot be undone and will remove all associated spots.
        </p>

        <div class="delete-actions">
          <button class="btn-cancel" (click)="closeModal()">Cancel</button>
          <button class="btn-delete" (click)="confirmDelete()">Delete lot</button>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['lot-delete-confirmation.css'],
  imports: [MatIcon]
})
export class LotDeleteConfirmationComponent{
  currentParkingLot = input.required<ParkingLot>();
  modalVisible = output<boolean>();
  parkingLotService = inject(ParkingLotService);

  closeModal(){
    this.modalVisible.emit(false);
  }

  confirm() {
    this.parkingLotService.submitDeleteRequest(this.currentParkingLot().id);
    this.closeModal();
  }

  confirmDelete() {
    this.parkingLotService.submitDeleteRequest(this.currentParkingLot().id);
    this.closeModal();
  }
}
