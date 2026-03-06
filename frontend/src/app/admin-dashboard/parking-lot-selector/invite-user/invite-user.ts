import { Component, inject, input, output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { InvitationService } from "../../../services/invitation-service";
import { ParkingLot } from "../../../interfaces/parkinglot";
import { InvitationData } from "../../../interfaces/invitationdata";
import { User } from "../../../interfaces/user";
import { ParkingLotService } from "../../../services/parking-lot-service";

@Component({
  selector: 'app-invite-user',
  template:`
    <section class="invite-user modal">
      <button class="close-modal-button" (click)="closeModal()">X</button>
      <div class="invitation">
        <label for="email">Email</label>
        <input id="email" type="email" [formControl]="email">
        <button (click)="onSendInvite()">Send invite</button>
      </div>
      <div class="user-management">
        <section>
          <h1>Current employees</h1>
          <div class="email-list">
            @for(employee of currentEmployees; track employee.id){
              <div class="user-section">
                <span class="user-email">{{employee.email}}</span>
                <button class="action-button" (click)="handleRevokeAccess(employee.id)">Revoke access</button>
              </div>
            }
          </div>
        </section>
        <section>
          <h1>Pending invites</h1>
          <div class="email-list hidden-scroll">
            @for(invite of pendingInvites; track invite.id){
              <div class="user-section">
                <span class="user-email">{{invite.email}}</span>
                <button class="action-button" (click)="handleCancelInvitation(invite.id)">Cancel invitation</button>
              </div>
            }
          </div>
        </section>
      </div>
    </section>
  `,
  imports: [ReactiveFormsModule],
  styleUrls: ['invite-user.css']
})
export default class InviteUserComponent{
  email = new FormControl('', [Validators.required]);
  currentParkingLot = input.required<ParkingLot>();
  invitationService = inject(InvitationService);
  parkingLotService = inject(ParkingLotService);
  pendingInvites: InvitationData[] = [];
  currentEmployees: User[] = [];
  modalVisible = output<boolean>();

  ngOnInit(){
    this.loadPendingInvites();
    this.loadCurrentEmployees();
  }

  closeModal(){
    this.modalVisible.emit(false);
  }

  async loadPendingInvites(){
    const parkingLotId = this.currentParkingLot().id;
    this.pendingInvites = await this.invitationService.getPendingInvites(parkingLotId);
  }

  async loadCurrentEmployees(){
    const parkingLotId = this.currentParkingLot().id;
    this.currentEmployees = await this.parkingLotService.getAllEmployees(parkingLotId);
  }

  async onSendInvite(){
    this.email.markAsTouched();

    if(this.email.invalid || !this.email.value){
      return;
    }

    const parkingLotId = this.currentParkingLot().id;
    const response = await this.invitationService.sendInvite({email: this.email.value, parkingLotId})
    this.loadPendingInvites();
  }

  async handleRevokeAccess(userId: number){
    const parkingLotId = this.currentParkingLot().id;
    await this.parkingLotService.removeEmployee(parkingLotId, userId);
    await this.loadCurrentEmployees();
  }

  async handleCancelInvitation(invitationId: number){
    const parkingLotId = this.currentParkingLot().id;
    await this.invitationService.cancelInvite(invitationId);
    await this.loadPendingInvites();
  }

}
