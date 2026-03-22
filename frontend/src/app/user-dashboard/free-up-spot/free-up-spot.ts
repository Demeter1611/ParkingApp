import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, inject, input, output } from "@angular/core";
import { ParkingSpotService } from '../../services/parking-spot-service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-free-up-spot',
  imports: [ReactiveFormsModule, MatIcon],
  template: `
  <section class="free-up-spot modal">
    <button class="close-modal-button" (click)="closeModal()"><mat-icon>close</mat-icon></button>
    <div class="content">
      <form [formGroup]="form">
        <input class="date-input" type="date" formControlName="startDate" [min]="minDate" [max]="maxDate">
        <input class="date-input" type="date" formControlName="endDate" [min]="form.get('start')?.value || minDate" [max]="maxDate">
      </form>

      <button class="confirm-button" (click)="onConfirm()">Confirm release</button>
    </div>
  </section>
  `,
  styleUrls: ['free-up-spot.css']
})
export default class FreeUpSpot{
  parkingSpotService = inject(ParkingSpotService);
  minDate: string;
  maxDate: string;
  modalVisible = output<boolean>();
  mySpot = input.required<ParkingSpot>();
  form!: FormGroup

  closeModal() {
    this.modalVisible.emit(false);
  }

  constructor(){
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    this.maxDate = thirtyDaysLater.toISOString().split('T')[0];

    this.form = new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl()
    }, { validators: this.dateRangeValidator }
  )}

  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const start = control.get('start')?.value;
      const end = control.get('end')?.value;

      return start && end && start > end ? { dateRangeInvalid: true } : null;
    }
  }

  async onConfirm() {
    this.form.markAllAsTouched();
    if(this.form.invalid){
      return;
    }

    const {startDate, endDate} = this.form.getRawValue();
    const response = await this.parkingSpotService.releaseSpot(this.mySpot().id, {startDate, endDate});

    if(!response.error){
      this.closeModal();
    }
  }
}
