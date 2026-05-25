import { ParkingLot } from './../../../interfaces/parkinglot';
import { Component, inject, input, output } from "@angular/core";
import { MatIcon } from '@angular/material/icon';
import { ParkingLotService } from '../../../services/parking-lot-service';

@Component({
  selector: 'app-parking-lot',
  template:`
    <section class="parking-lot-card">
      <div class="card-header">
        <div class="title-group">
          <h3>{{ parkingLot().name }}</h3>
          <span class="address">{{ parkingLot().address }}</span>
        </div>
        <button class="menu-btn" (click)="toggleMenu($event)">
          <mat-icon>more_vert</mat-icon>
        </button>

        @if(isMenuOpen) {
          <div class="dropdown-menu">
            <button (click)="onAction('edit')"><mat-icon>edit</mat-icon> Edit details</button>
            <button (click)="onAction('manage-employees')"><mat-icon>man</mat-icon> Manage employees</button>
            <button (click)="onAction('manage-spots')"><mat-icon>grid_view</mat-icon> Manage spots</button>
            <button class="danger" (click)="onAction('delete')"><mat-icon>delete</mat-icon> Delete lot</button>
          </div>
        }
      </div>

      <div class="card-stats">
        <div class="stat-box">
          <span class="stat-value">{{ this.totalSpots }}</span>
          <span class="stat-label">Total spots</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-value text-warning">{{ this.occupiedSpots }}</span>
          <span class="stat-label">Occupied</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-value text-success">{{ this.freeSpots }}</span>
          <span class="stat-label">Free</span>
        </div>
      </div>
    </section>
  `,
  styleUrls:['parking-lot.css'],
  imports: [MatIcon]
})
export default class ParkingLotComponent{
  parkingLot = input.required<ParkingLot>();
  parkingLotService = inject(ParkingLotService);
  actionSelected = output<{action: string, lot: ParkingLot}>();
  totalSpots: number = 0;
  occupiedSpots: number = 0;
  freeSpots: number = 0;

  isMenuOpen = false;

  toggleMenu(event: MouseEvent){
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(){
    this.loadStats();
  }

  async loadStats(){
    const parkingSpots = await this.parkingLotService.getSpotsWithStatus(this.parkingLot().id, new Date());
    if(parkingSpots && parkingSpots.length > 0){
      this.totalSpots = parkingSpots.length;
      this.freeSpots = parkingSpots.filter((spot: any) => spot.status === 'available').length;
      this.occupiedSpots = this.totalSpots - this.freeSpots;
    } else {
      this.totalSpots = 0;
      this.occupiedSpots = 0;
      this.freeSpots = 0;
    }
  }

  onAction(actionType: string) {
    this.actionSelected.emit({ action: actionType, lot: this.parkingLot() });
    this.isMenuOpen = false;
  }
}
