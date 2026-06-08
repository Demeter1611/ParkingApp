import { Component, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { ParkingLot } from "../../interfaces/parkinglot";
import { ParkingSpotService } from "../../services/parking-spot-service";
import { ParkingLotService } from "../../services/parking-lot-service";
import { ParkingSpot } from "../../interfaces/parkingspot";
import { RefreshService } from "../../services/refresh-service";

@Component({
  selector: 'app-manage-spots',
  template: `
    <section class="manage-spots-modal modal">
      <div class="modal-content wide-modal">

        <div class="modal-header">
           <div class="header-title">
             <h2>Manage Spots</h2>
             <span class="subtitle">{{ currentParkingLot().name }}</span>
           </div>
           <button class="close-modal-button" (click)="closeModal()">
             <mat-icon>close</mat-icon>
           </button>
        </div>

        <div class="modal-body-split">

          <div class="left-panel">
            <div class="panel-header-simple">
              <h3>Bulk Generate Spots</h3>
              <p>Create multiple spots at once.</p>
            </div>

            <form [formGroup]="bulkForm" class="bulk-form">
              <div class="form-group">
                <label>Pattern (Use $ for numbering)</label>
                <input type="text" formControlName="pattern" placeholder="e.g. Spot-A-$">
                <span class="hint">Prefix/Suffix stays, $ becomes the number.</span>
              </div>

              <div class="form-row-3">
                <div class="form-group">
                  <label>Start Range</label>
                  <input type="number" formControlName="startRange" placeholder="1">
                </div>
                <div class="form-group">
                  <label>End Range</label>
                  <input type="number" formControlName="endRange" placeholder="50">
                </div>
                <div class="form-group">
                  <label>Padding</label>
                  <input type="number" formControlName="padding" placeholder="3" title="Number of digits (e.g., 3 -> 001)">
                </div>
              </div>

              <div class="live-preview-box">
                 <span class="preview-title">Preview:</span>
                 <span class="preview-text">
                   {{ getPreviewText() }}
                 </span>
              </div>

              <button class="primary-btn submit-bulk"
                      (click)="onBulkGenerate()"
                      [disabled]="bulkForm.invalid">
                <mat-icon>library_add</mat-icon> Generate Spots
              </button>
            </form>
          </div>

          <div class="right-panel">
            <div class="panel-header-list">
              <h3>Existing Spots</h3>
              <span class="spot-badge">Total: {{ parkingSpots.length }}</span> </div>

            <div class="spots-list hidden-scroll">
              @for(spot of parkingSpots; track spot.id){
                <div class="spot-item">
                  <div class="spot-info">
                    <mat-icon class="icon-car">directions_car</mat-icon>
                    <div class="text-info">
                      <span class="spot-name">{{spot.name}}</span>
                      @if(spot.status === 'locked'){
                        <span class="owner-email">{{spot.ownerUsername}}</span>
                      }
                    </div>
                  </div>

                  <div class="action-area">
                    @if(spotToDeleteId === spot.id) {
                      <div class="inline-confirm">
                        <span class="confirm-text">Sure?</span>
                        <button class="confirm-btn yes" (click)="confirmDelete(spot.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button class="confirm-btn no" (click)="cancelDelete()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    } @else {
                      <button class="icon-btn text-danger" title="Delete spot" (click)="initiateDelete(spot.id)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                  </div>

                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styleUrls: ['manage-spots.css'],
  imports: [ReactiveFormsModule, MatIcon]
})
export default class ManageSpotsModalComponent {
  currentParkingLot = input.required<ParkingLot>();
  parkingSpotService = inject(ParkingSpotService);
  parkingLotService = inject(ParkingLotService);
  private refresh = inject(RefreshService);
  parkingSpots: ParkingSpot[] = [];
  modalVisible = output<boolean>();

  spotToDeleteId: number | null = null;

  initiateDelete(spotId: number) {
    this.spotToDeleteId = spotId;
  }

  cancelDelete(){
    this.spotToDeleteId = null;
  }

  async confirmDelete(spotId: number) {
    await this.parkingSpotService.submitDeleteRequest(spotId);
    this.spotToDeleteId = null;
    await this.loadSpots();
    this.refresh.notify();
  }

  bulkForm = new FormGroup({
    pattern: new FormControl('A-$', [Validators.required]),
    startRange: new FormControl(1, [Validators.required, Validators.min(1)]),
    endRange: new FormControl(50, [Validators.required, Validators.min(1)]),
    padding: new FormControl(3, [Validators.required, Validators.min(1), Validators.max(5)])
  });

  closeModal() {
    this.modalVisible.emit(false);
  }

  async loadSpots(){
    this.parkingSpots = await this.parkingLotService.getSpotsWithStatus(this.currentParkingLot().id, new Date());
  }

  async ngOnInit(){
    this.loadSpots();
  }

  getPreviewText(): string {
    const vals = this.bulkForm.value;
    if (!vals.pattern || !vals.startRange || !vals.endRange || !vals.padding) return "Waiting for input...";

    if (vals.startRange > vals.endRange) return "Error: Start range must be smaller than End range.";

    const startPad = vals.startRange.toString().padStart(vals.padding, '0');
    const endPad = vals.endRange.toString().padStart(vals.padding, '0');

    const startStr = vals.pattern.replace('$', startPad);
    const endStr = vals.pattern.replace('$', endPad);

    return `${startStr} ... ${endStr}`;
  }

  async onBulkGenerate() {
    if (this.bulkForm.invalid) return;

    const formValues = this.bulkForm.value;
    const requestBody = {
       parkingSpotGenerator: {
           pattern: formValues.pattern,
           startRange: formValues.startRange,
           endRange: formValues.endRange,
           padding: formValues.padding
       },
       parkingLotId: this.currentParkingLot().id
    };

    await this.parkingSpotService.submitAddBulkRequest(requestBody);

    await this.loadSpots();
    this.refresh.notify();
  }
}
