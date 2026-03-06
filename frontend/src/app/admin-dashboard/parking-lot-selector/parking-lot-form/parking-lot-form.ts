import { Component, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ParkingLotService } from "../../../services/parking-lot-service";
import { ParkingLot } from "../../../interfaces/parkinglot";

@Component({
  selector: 'app-parking-lot-form',
  imports: [ReactiveFormsModule],
  template:`
    <section class="parking-lot-form modal">
      <button class="close-modal-button" (click)="closeModal()">X</button>
      <form [formGroup]="parkingLotForm">
        <div class="form-field">
          <label for="name">Name:</label>
          <input class="text-input" id="name" type="text" formControlName="name"/>
        </div>
        <div class="form-field">
          <label for="address">Address:</label>
          <input class="text-input" id="address" type="text" formControlName="address"/>
        </div>
        <div class="form-field">
          <label for="max-capacity">Max capacity:</label>
          <input class="text-input" id="max-capacity" type="number" formControlName="maxCapacity"/>
        </div>
        <div class="options">
          <div class="toggle-field">
            <label for="timeslots">Timeslots</label>
            <input id="timeslots" type="checkbox" formControlName="timeslotsEnabled"/>
          </div>
          <div class="toggle-field">
            <label for="sharing">Sharing</label>
            <input id="sharing" type="checkbox" formControlName="sharingEnabled"/>
          </div>
          <div class="toggle-field">
            <label for="temporary-only">Temporary-only</label>
            <input id="temporary-only" type="checkbox" formControlName="temporaryOnlyEnabled"/>
          </div>
          <div class="toggle-field">
            <label for="simplified-grid">Simplified grid</label>
            <input id="simplified-grid" type="checkbox" formControlName="simplifiedGridEnabled">
          </div>
        </div>
        @if(!this.currentParkingLot()){
          <button class="submit" (click)="onCreateSubmit()">Create lot</button>
        }
        @else {
          <button class="submit" (click)="onMakeChanges()">Make changes</button>
          <button class="delete" (click)="onDelete()">Delete</button>
        }
      </form>
    </section>
  `,
  styleUrls:['parking-lot-form.css']
})
export default class ParkingLotFormComponent{
  parkingLotForm!: FormGroup;
  parkingLotService = inject(ParkingLotService);
  currentParkingLot = input<ParkingLot>();
  modalVisible = output<boolean>();
  refreshPage = output<boolean>();

  closeModal(){
    this.modalVisible.emit(false);
  }

  refresh(){
    this.refreshPage.emit(true);
  }

  ngOnInit(){
    this.parkingLotForm = new FormGroup(
      {
          name: new FormControl('', [
            Validators.required
          ]),
          address: new FormControl('', [
            Validators.required
          ]),
          maxCapacity: new FormControl(0, [
            Validators.required
          ]),
          timeslotsEnabled: new FormControl(false),
          sharingEnabled: new FormControl(false),
          temporaryOnlyEnabled: new FormControl(false),
          simplifiedGridEnabled: new FormControl(false),
      }
    );
    const lot = this.currentParkingLot();
    if(lot){
      this.parkingLotForm.patchValue(lot);
    }
  }

  async onCreateSubmit() {
    this.parkingLotForm.markAllAsTouched();
    if(this.parkingLotForm.invalid){
      return;
    }

    const { name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, simplifiedGridEnabled} = this.parkingLotForm.value;

    const response = await this.parkingLotService.submitAddRequest({name,
      address,
      maxCapacity,
      timeslotsEnabled,
      sharingEnabled,
      temporaryOnlyEnabled,
      visitorSpotsEnabled: false,
      simplifiedGridEnabled});
    if(!response.error){
      console.log('succesfully created');
      this.closeModal();
      this.refresh();
    }
  }

  async onMakeChanges(){
    const parkingLotId = this.currentParkingLot()?.id;
    if(parkingLotId){
      const { name, address, maxCapacity, timeslotsEnabled, sharingEnabled, temporaryOnlyEnabled, simplifiedGridEnabled} = this.parkingLotForm.value;
      const response = await this.parkingLotService.submitUpdateRequest(parkingLotId, {name,
        address,
        maxCapacity,
        timeslotsEnabled,
        sharingEnabled,
        temporaryOnlyEnabled,
        simplifiedGridEnabled
      });
      if(!response.error){
        console.log('successfully patched');
        this.closeModal();
        this.refresh();
      }
    }
  }

  async onDelete(){
    const parkingLotId = this.currentParkingLot()?.id;
    if(parkingLotId){
      const response = await this.parkingLotService.submitDeleteRequest(parkingLotId);
      if(!response.error){
        console.log('successfully deleted');
        this.closeModal();
        this.refresh();
      }
    }
  }
}
