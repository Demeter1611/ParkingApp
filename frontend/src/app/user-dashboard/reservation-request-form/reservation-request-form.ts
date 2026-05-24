import { Component, inject, input, output } from "@angular/core";
import { ParkingLot } from "../../interfaces/parkinglot";
import { DatePipe } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReservationRequestService } from "../../services/reservation-request-service";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-reservation-request-form',
  imports: [ReactiveFormsModule, MatIcon, DatePipe],
  template:`
    <section class='reservation-request-form modal'>
      <button class="close-modal-button" (click)="closeModal()"><mat-icon>close</mat-icon></button>
      <div class="modal-content">
        <div class="header">
          <h2>Create reservation request for <br> <span class="date">{{requestDates().startDate | date: 'MMM d'}} - {{requestDates().endDate | date: 'MMM d, yyyy'}}</span></h2>
        </div>
        <form [formGroup]="reservationRequestForm">
          <div class="form-field">
            <label for="reason">Reason</label>
            <textarea id="reason" type="reason" formControlName="reason"></textarea>
          </div>
          <button (click)='onSubmit()'>Make request</button>
        </form>
      </div>
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
      startDate: this.requestDates().startDate,
      endDate: this.requestDates().endDate
    });

    if(!response.error){
      console.log('succesfully created');
      this.closeModal();
    }
  }
}
