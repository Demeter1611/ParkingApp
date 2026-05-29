import { Component, inject, output } from "@angular/core";
import { NotificationService } from "../../services/notification-service";
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from "@angular/common";

@Component({
  selector: 'app-notifications-dropdown',
  imports: [MatIconModule, DatePipe, NgClass],
  template: `
    <div class="notifications-dropdown" (click)="$event.stopPropagation()">
      
      <div class="dropdown-header">
        <h3>Notifications</h3>
        @if(notificationService.unreadCount() > 0) {
          <button class="mark-all-btn" (click)="onMarkAllAsRead()">Mark all as read</button>
        }
      </div>
      
      <div class="notifications-list hidden-scroll">
        @if(notificationService.notifications().length === 0) {
          <div class="empty-notifications">
            <mat-icon>notifications_off</mat-icon>
            <p>You have no new notifications.</p>
          </div>
        } @else {
          @for(notif of notificationService.notifications(); track notif.id) {
            
            <div class="notification-item" 
                 [class.unread]="!notif.isRead"
                 (click)="onNotificationClick(notif.id, notif.isRead)">
              
              <div class="notif-icon" [ngClass]="notif.type">
                <mat-icon>{{ getIconForType(notif.type) }}</mat-icon>
              </div>
              
              <div class="notif-content">
                <h4>{{ notif.title }}</h4>
                <p>{{ notif.message }}</p>
                <span class="time">{{ notif.createdAt | date:'MMM d, yyyy' }}</span>
              </div>
              
              @if(!notif.isRead) {
                <div class="unread-dot"></div>
              }
            </div>
          }
        }
      </div>

    </div>
  `,
  styleUrls: ['notifications-dropdown.css']
})
export class NotificationsDropdownComponent {
  notificationService = inject(NotificationService);
  closeDropdown = output<void>();

  onNotificationClick(id: number, isRead: boolean) {
    if (!isRead) {
      this.notificationService.markAsRead(id);
    }
  }

  onMarkAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  getIconForType(type: string): string {
    switch(type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}