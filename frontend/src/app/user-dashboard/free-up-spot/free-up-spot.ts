import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParkingSpot } from './../../interfaces/parkingspot';
import { Component, input, output } from "@angular/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-free-up-spot',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  template: `
  <section class="free-up-spot modal">
    <button class="close-modal-button" (click)="closeModal()">X</button>
    <div class="content">
    </div>
  </section>
  `,
  styleUrls: ['free-up-spot.css']
})
export default class FreeUpSpot{
  modalVisible = output<boolean>();
  mySpot = input.required<ParkingSpot>();

  closeModal() {
    this.modalVisible.emit(false);
  }
}
