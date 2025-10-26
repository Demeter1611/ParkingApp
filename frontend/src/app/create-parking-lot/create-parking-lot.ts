import { NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { ParkingLotService } from "../services/parking-lot-service";

@Component({
  selector: 'app-create-parking-lot',
  imports: [ReactiveFormsModule, FontAwesomeModule, NgClass],
  template: `
    <section>
      <h1>Create a new parking lot</h1>
      <form [formGroup]="parkingLotForm">
        <div class="form-field">
          <label for="name">Name</label>
          <input id="name" formControlName="name">
        </div>
        <div class="form-field">
          <label for="address">Address</label>
          <input id="address" formControlName="address">
        </div>
        <div class="form-field">
          <label for="max-capacity">Maximum capacity</label>
          <input id="max-capacity" formControlName="maxCapacity" type="number">
        </div>
        <div class="advanced-header" (click)="collapseAdvanced()">
          Advanced settings
          <fa-icon [icon]="!isAdvancedCollapsed ? faAngleUp : faAngleDown"></fa-icon>
        </div>
        <div class="advanced-settings" [ngClass]="{'shown': !isAdvancedCollapsed}">
          <label class="checkbox-field">
            <label for="timeslots">Timeslots</label>
            <input id="timeslots" type="checkbox" formControlName="timeslotsEnabled">
            <span class="checkmark"></span>
          </label>
          <label class="checkbox-field">
            <label for="sharing">Allow sharing</label>
            <input id="sharing" type="checkbox" formControlName="sharingEnabled">
            <span class="checkmark"></span>
          </label>
          <label class="checkbox-field">
            <label for="temporary-only">Only temporary reservations</label>
            <input id="temporary-only" type="checkbox" formControlName="temporaryOnlyEnabled">
            <span class="checkmark"></span>
          </label>
          <label class="checkbox-field">
            <label for="visitor-spots">Allocate visitor spots</label>
            <input id="visitor-spots" type="checkbox" formControlName="visitorSpotsEnabled">
            <span class="checkmark"></span>
          </label>
          <label class="checkbox-field">
            <label for="simplified-grid">Simplified grid mode</label>
            <input id="simplified-grid" type="checkbox" formControlName="simplifiedGridEnabled">
            <span class="checkmark"></span>
          </label>
        </div>

        <button class="primary-button" type="submit" (click)="onSubmit()">Create lot</button>
      </form>
    </section>
  `,
  styleUrl: './create-parking-lot.css',
})
export class CreateParkingLotComponent {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  parkingLotForm!: FormGroup;
  isAdvancedCollapsed: boolean = true;
  parkingLotService = inject(ParkingLotService);

  ngOnInit(){
    this.parkingLotForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required
        ]),
        address: new FormControl('', [
          Validators.required
        ]),
        maxCapacity: new FormControl(undefined, [
          Validators.required,
          Validators.min(0)
        ]),
        timeslotsEnabled: new FormControl(false),
        sharingEnabled: new FormControl(false),
        temporaryOnlyEnabled: new FormControl(false),
        visitorSpotsEnabled: new FormControl(false),
        simplifiedGridEnabled: new FormControl(false)
      }
    )
  }

  collapseAdvanced(){
    this.isAdvancedCollapsed = !this.isAdvancedCollapsed;
  }

  async onSubmit(): Promise<void> {
    try{
      await this.parkingLotService.submitAddRequest(this.parkingLotForm.value);
      console.log('Lot created');
    } catch (error) {
      console.error(error);
    }
  }
}
