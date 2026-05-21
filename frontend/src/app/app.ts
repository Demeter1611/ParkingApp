import { AuthenticationService } from './services/authentication-service';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Topbar } from "./topbar/topbar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar],
  template:`
    <div class="container">
      <app-topbar/>
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
