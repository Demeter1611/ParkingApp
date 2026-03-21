import { Component, inject } from "@angular/core";
import { TopbarService } from "../services/topbar-service";
import { AuthenticationService } from "../services/authentication-service";
import { User } from "../interfaces/user";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from "@angular/router";

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule],
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
          <mat-icon class="icon">notifications</mat-icon>
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
  topbarService = inject(TopbarService);
  user: User | null;
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
}
