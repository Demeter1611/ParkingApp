import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReservationRequestService } from "../../services/reservation-request-service";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-reservation-request-form',
  imports: [ReactiveFormsModule, MatIcon],
  template:`
    <section class='reservation-request-form modal'>
      <button class="close-modal-button" (click)="closeModal()"><mat-icon>close</mat-icon></button>
      <form [formGroup]="reservationRequestForm">
        <div class="form-field">
          <label for="reason">Reason</label>
          <input class="text-input" id="reason" type="reason" formControlName="reason"/>
        </div>
        <button (click)='onSubmit()'>Make request</button>
      </form>
    </section>
  `,
  styleUrls: ['reservation-request-form.css']
}) export default class ReservationRequestForm {
  modalVisible = output<boolean>();
  currentParkingLot = input.required<ParkingLot>();
  requestDates = input.required<{startDate: Date, endDate: Date}>();

  reservationRequestForm!: FormGroup;
  reservationRequestService = inject(ReservationRequestService);

  closeModal(){
    this.modalVisible.emit(false);
  }

  ngOnInit(){
    this.reservationRequestForm = new FormGroup(
      {
        reason: new FormControl('', [
          Validators.required
        ])
      }
    );
  }

  async onSubmit(){
    this.reservationRequestForm.markAllAsTouched();
    if(this.reservationRequestForm.invalid){
      return;
    }

    const { reason } = this.reservationRequestForm.value;

    const response = await this.reservationRequestService.createRequest({
      parkingLotId: this.currentParkingLot().id,
      reason,
      requestedDate: this.requestDates().startDate
    });

    if(!response.error){
      console.log('succesfully created');
      this.closeModal();
    }
  }
}
