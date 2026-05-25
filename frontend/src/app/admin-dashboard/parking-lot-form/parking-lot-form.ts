import { Component, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingLot } from "../../interfaces/parkinglot";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-parking-lot-form',
  imports: [ReactiveFormsModule, MatIcon],
  template: `
    <section class="parking-lot-form modal">
      <div class="modal-content standard-modal">

        <div class="modal-header">
           <h2>{{ isEditMode ? 'Edit Parking Lot' : 'Create New Lot' }}</h2>
           <button class="close-modal-button" (click)="closeModal()">
             <mat-icon>close</mat-icon>
           </button>
        </div>

        <form [formGroup]="parkingLotForm" class="lot-form">

          <div class="form-group">
            <label for="name">Lot Name</label>
            <input id="name" type="text" formControlName="name" placeholder="e.g. Main HQ Parking">
            @if(parkingLotForm.get('name')?.invalid && parkingLotForm.get('name')?.touched){
              <span class="error-msg">Name is required</span>
            }
          </div>

          <div class="form-group">
            <label for="address">Address</label>
            <input id="address" type="text" formControlName="address" placeholder="e.g. 123 Tech Blvd, City">
            @if(parkingLotForm.get('address')?.invalid && parkingLotForm.get('address')?.touched){
              <span class="error-msg">Address is required</span>
            }
          </div>

          <div class="form-actions">
            <button class="btn-cancel" type="button" (click)="closeModal()">Cancel</button>
            <button class="primary-btn" type="submit" (click)="onSubmit()" [disabled]="parkingLotForm.invalid">
              <mat-icon>{{ isEditMode ? 'save' : 'add_circle' }}</mat-icon>
              {{ isEditMode ? 'Save Changes' : 'Create Lot' }}
            </button>
          </div>

        </form>

      </div>
    </section>
  `,
  styleUrls: ['parking-lot-form.css']
})
export default class ParkingLotFormComponent {
  parkingLotForm!: FormGroup;
  parkingLotService = inject(ParkingLotService);
  currentParkingLot = input<ParkingLot | null>();
  modalVisible = output<boolean>();
  refreshPage = output<boolean>();

  get isEditMode(): boolean {
    return !!this.currentParkingLot();
  }

  closeModal() {
    this.modalVisible.emit(false);
  }

  refresh() {
    this.refreshPage.emit(true);
  }

  ngOnInit() {
    this.parkingLotForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    });

    const lot = this.currentParkingLot();
    if (lot) {
      this.parkingLotForm.patchValue(lot);
    }
  }

  async onSubmit() {
    this.parkingLotForm.markAllAsTouched();
    if (this.parkingLotForm.invalid) {
      return;
    }

    const { name, address } = this.parkingLotForm.value;
    let response;

    if (this.isEditMode) {
      const parkingLotId = this.currentParkingLot()!.id;
      response = await this.parkingLotService.submitUpdateRequest(parkingLotId, { name, address });
    } else {
      response = await this.parkingLotService.submitAddRequest({
        name,
        address
      });
    }

    if (response && !response.error) {
      console.log(`Successfully ${this.isEditMode ? 'updated' : 'created'}`);
      this.closeModal();
      this.refresh();
    } else {
      console.error('Action failed:', response?.error);
    }
  }
}
