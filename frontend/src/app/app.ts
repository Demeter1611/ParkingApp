import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template:`
    <section class="top-bar">
      <img class="logo" src="assets/logo.png">
      <button>Login</button>
    </section>
    <router-outlet/>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
