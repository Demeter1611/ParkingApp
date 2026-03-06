import { AuthenticationService } from './services/authentication-service';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Topbar } from "./topbar/topbar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Topbar],
  template:`
    <div class="container">
      <app-topbar/>
      <!-- <section class="top-bar">
        <a href="/">
          <img class="logo" src="assets/parking-lot.png" >
        </a>
        @if(!authenticationService.isAuthenticated()){
          <button routerLink="/auth" class="primary-button">Login</button>
        }
        @else{
          <button>{{ authenticationService.userEmail }}</button>
          <button (click)="authenticationService.logout()">Logout</button>
        }
      </section> -->
      <main class="content">
        <router-outlet/>
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  authenticationService = inject(AuthenticationService);
}
