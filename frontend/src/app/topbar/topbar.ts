import { Component, inject } from "@angular/core";
import { TopbarService } from "../services/topbar-service";
import { AuthenticationService } from "../services/authentication-service";
import { User } from "../interfaces/user";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from "@angular/router";
import { NotificationsDropdownComponent } from "./notifications-dropdown/notifications-dropdown";
import { NotificationService } from "../services/notification-service";

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule, NotificationsDropdownComponent],
  template:`
  @if(topbarService.showTopbar()){
    <section class="topbar" [class.with-bg]="!topbarService.transparentBackground()">
      <div class="navigation">
        <h1 class="title">{{topbarService.title()}}</h1>
      </div>
      @if(user){
        <button class="topbar-button" (click)="onToggleNavigation()"><mat-icon>{{!isDashboard() ? 'dashboard' : 'home'}}</mat-icon>{{!isDashboard() ? 'Dashboard' : 'Home'}}</button>
        <div class="user-actions">
          <h3 class="no-select">{{user.email}}</h3>
          <div class="notifications-wrapper" (clickOutside)="showNotifications = false">
            
            <div class="notification-trigger" (click)="toggleNotifications($event)">
              <mat-icon class="icon">notifications</mat-icon>
              @if(notificationService.unreadCount() > 0) {
                <span class="unread-badge">{{ notificationService.unreadCount() }}</span>
              }
            </div>

            @if(showNotifications) {
              <app-notifications-dropdown (closeDropdown)="showNotifications = false" />
            }
          </div>
          <mat-icon class="icon" (click)="onLogout()">logout</mat-icon>
        </div>
      }
      @else {
        <button class='topbar-button' (click)="onLogin()">Login <mat-icon>login</mat-icon></button>
      }
    </section>
  }
  `,
  styleUrls: ["topbar.css"],
}) export class Topbar{
  authService = inject(AuthenticationService);
  notificationService = inject(NotificationService);
  topbarService = inject(TopbarService);
  user: User | null;
  showNotifications: boolean = false;
  router = inject(Router);

  constructor() {
    this.user = this.authService.user;
  }

  onLogout() {
    this.authService.logout();
    window.location.href = '/';
  }

  onLogin(){
    this.router.navigate(['/auth']);
  }

  onToggleNavigation(){
    if(this.isDashboard()){
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  isDashboard(){
    return this.router.url === '/dashboard';
  }

  toggleNotifications(event: MouseEvent) {
    this.showNotifications = !this.showNotifications;
  }
}
