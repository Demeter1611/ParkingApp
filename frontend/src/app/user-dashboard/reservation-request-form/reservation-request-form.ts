import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReservationRequestService } from "../../services/reservation-request-service";

@Component({
  selector: 'app-reservation-request-form',
  imports: [ReactiveFormsModule],
  template:`
    <section class='reservation-request-form modal'>
      <button class="close-modal-button" (click)="closeModal()">X</button>
      <form [formGroup]="reservationRequestForm">
        <div class="form-field">
          <label for="reason">Reason</label>
          <input class="text-input" id="reason" type="reason" formControlName="reason"/>
        </div>
        <div class="form-field">
          <label for="date">Date</label>
          <input id="date" type="date" formControlName="requestedDate"/>
        </div>
        <button (click)='onSubmit()'>Make request</button>
      </form>
    </section>
  `,
  styleUrls: ['reservation-request-form.css']
}) export default class ReservationRequestForm {
  modalVisible = output<boolean>();
  currentParkingLot = input.required<ParkingLot>();

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
        ]),
        requestedDate: new FormControl([Validators.required])
      }
    );
  }

  async onSubmit(){
    this.reservationRequestForm.markAllAsTouched();
    if(this.reservationRequestForm.invalid){
      return;
    }

    const { reason, requestedDate } = this.reservationRequestForm.value;

    const response = await this.reservationRequestService.createRequest({
      parkingLotId: this.currentParkingLot().id,
      reason,
      requestedDate
    });

    if(!response.error){
      console.log('succesfully created');
      this.closeModal();
    }
  }
}
