import { Component, inject, input, output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { InvitationService } from "../../services/invitation-service";
import { ParkingLot } from "../../interfaces/parkinglot";
import { InvitationData } from "../../interfaces/invitationdata";
import { User } from "../../interfaces/user";
import { ParkingLotService } from "../../services/parking-lot-service";
import { MatIcon } from "@angular/material/icon";
import { ParkingSpot } from "../../interfaces/parkingspot";
import { ParkingSpotService } from "../../services/parking-spot-service";
import { RefreshService } from "../../services/refresh-service";

interface UserManagementItem{
  id: number,
  email: string,
  type: 'employee' | 'invite'
}

@Component({
  selector: 'app-manage-employees',
  template:`
    <section class="manage-employees modal">
      <div class="modal-content">

        @if(!allocatingUser) {
          <div class="modal-header">
            <h2>Manage Access</h2>
            <button class="close-modal-button" (click)="closeModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="invitation-bar">
            <input id="email" type="email" placeholder="employee@company.com" [formControl]="email">
            <button class="primary-btn" (click)="onSendInvite()">
              <mat-icon>send</mat-icon> Send Invite
            </button>
          </div>

          <div class="user-management">
            <div class="list-header">
              <h3>Current Users & Invites</h3>
              <span class="count-badge">Total: {{ userManagementList.length }}</span>
            </div>

            <div class="email-list hidden-scroll">
              @for(user of userManagementList; track user.id){
                <div class="user-item">
                  <span class="user-email">{{user.email}}</span>

                  <div class="user-actions">
                    <span class="badge"
                          [class.pending]="user.type === 'invite'"
                          [class.employee]="user.type === 'employee'">
                      {{user.type === 'employee' ? "Employee" : "Pending"}}
                    </span>

                    @if(confirmingUserId === user.id) {
                      <div class="inline-confirm">
                        <span class="confirm-text">Sure?</span>
                        <button class="confirm-btn yes"
                                (click)="user.type === 'employee' ? confirmRevokeAccess(user.id) : confirmCancelInvitation(user.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button class="confirm-btn no" (click)="cancelConfirm()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    } @else {
                      @if(user.type === 'employee'){
                        <button class="action-btn text-primary" title="Allocate new spot" (click)="startAllocation(user)">
                          <mat-icon>directions_car</mat-icon>
                        </button>
                        <button class="action-btn text-danger" (click)="initiateConfirm(user.id)" title="Revoke access">
                          <mat-icon>person_remove</mat-icon>
                        </button>
                      }
                      @else {
                        <button class="action-btn text-warning" (click)="initiateConfirm(user.id)" title="Cancel invite">
                          <mat-icon>cancel</mat-icon>
                        </button>
                      }
                    }
                  </div>
                </div>
              }

              @if(userManagementList.length === 0){
                <p class="empty-state">No employees or pending invites.</p>
              }
            </div>
          </div>
        }

        @else {
          <div class="modal-header">
            <div class="header-titles">
              <h2>Allocate Spot</h2>
              <span class="subtitle">{{ allocatingUser.email }}</span>
            </div>
            <button class="close-modal-button" (click)="cancelAllocation()">
              <mat-icon>arrow_back</mat-icon>
            </button>
          </div>

          <div class="allocation-body">
            @if(availableSpots.length === 0) {
              <div class="no-spots-warning">
                <mat-icon>warning_amber</mat-icon>
                <p>No available spots in this parking lot.</p>
              </div>
            } @else {
              <div class="form-group">
                <label>Select a spot to allocate</label>
                <select class="dark-select" [formControl]="selectedSpotId">
                  @for(spot of availableSpots; track spot.id) {
                    <option [value]="spot.id">{{ spot.name }}</option>
                  }
                </select>
                <span class="hint">The first available spot is selected by default.</span>
              </div>
            }

            <div class="form-actions">
              <button class="btn-cancel" (click)="cancelAllocation()">Cancel</button>
              <button class="primary-btn" (click)="confirmAllocation()" [disabled]="availableSpots.length === 0 || selectedSpotId.invalid">
                <mat-icon>check_circle</mat-icon> Confirm Allocation
              </button>
            </div>
          </div>
        }

      </div>
    </section>
  `,
  imports: [ReactiveFormsModule, MatIcon],
  styleUrls: ['manage-employees.css']
})
export default class ManageEmployeesComponent{
  email = new FormControl('', [Validators.required]);
  currentParkingLot = input.required<ParkingLot>();
  invitationService = inject(InvitationService);
  parkingLotService = inject(ParkingLotService);
  parkingSpotService = inject(ParkingSpotService);
  private refresh = inject(RefreshService);
  pendingInvites: InvitationData[] = [];
  currentEmployees: User[] = [];
  modalVisible = output<boolean>();

  allocatingUser: UserManagementItem | null = null;
  availableSpots: ParkingSpot[] = [];
  selectedSpotId = new FormControl<number | null>(null, [Validators.required]);

  userManagementList: UserManagementItem[] = [];
  confirmingUserId: number | null = null;

  ngOnInit(){
    this.loadData();
  }

  closeModal(){
    this.modalVisible.emit(false);
  }

  async loadData() {
    const parkingLotId = this.currentParkingLot().id;

    const [employees, invites] = await Promise.all([
      this.parkingLotService.getAllEmployees(parkingLotId),
      this.invitationService.getPendingInvites(parkingLotId)
    ]);

    const mappedEmployees: UserManagementItem[] = employees.map((emp: {id: number, email: string}) => ({
      id: emp.id,
      email: emp.email,
      type: 'employee'
    }));

    const mappedInvites: UserManagementItem[] = invites.map((inv: {id: number, email: string})=> ({
      id: inv.id,
      email: inv.email,
      type: 'invite'
    }));

    this.userManagementList = [...mappedEmployees, ...mappedInvites];
  }

  initiateConfirm(userId: number) {
    this.confirmingUserId = userId;
  }

  cancelConfirm() {
    this.confirmingUserId = null;
  }

  async onSendInvite(){
    this.email.markAsTouched();

    if(this.email.invalid || !this.email.value){
      return;
    }

    const parkingLotId = this.currentParkingLot().id;
    const response = await this.invitationService.sendInvite({email: this.email.value, parkingLotId})
    this.loadData()
  }

  async confirmRevokeAccess(userId: number){
    const parkingLotId = this.currentParkingLot().id;
    await this.parkingLotService.removeEmployee(parkingLotId, userId);
    this.confirmingUserId = null;
    await this.loadData();
  }

  async confirmCancelInvitation(invitationId: number){
    await this.invitationService.cancelInvite(invitationId);
    this.confirmingUserId = null;
    await this.loadData();
  }

  async startAllocation(user: UserManagementItem) {
    this.allocatingUser = user;

    const allSpots = await this.parkingLotService.getSpotsWithStatus(this.currentParkingLot().id, new Date());
    this.availableSpots = allSpots.filter((s: any) => s.status === 'available');

    if(this.availableSpots.length > 0) {
      this.selectedSpotId.setValue(this.availableSpots[0].id)
    } else {
      this.selectedSpotId.setValue(null);
    }
  }

  cancelAllocation() {
    this.allocatingUser = null;
    this.selectedSpotId.reset();
  }

  async confirmAllocation() {
    if (this.selectedSpotId.invalid || !this.allocatingUser) return;

    const spotId = this.selectedSpotId.value;
    const userId = this.allocatingUser.id;
    if(spotId){
      await this.parkingSpotService.allocateSpot(spotId, userId);
    }

    this.cancelAllocation();
    await this.loadData();
    this.refresh.notify();
  }
}
