import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <section class="auth-container">
      <div class="form-type-selectors">
        <button class="tab" [ngClass]="{'active': selectedForm === 'Login'}" (click)="tabSwitch('Login')">Login</button>
        <button class="tab" [ngClass]="{'active': selectedForm === 'Register'}" (click)="tabSwitch('Register')">Register</button>
      </div>
      @if(selectedForm === "Login") {
        <form [formGroup]="login">
          <div class="form-field">
            <label for="login-email">Email:</label>
            <input id="login-email" type="email" formControlName="email">
          </div>

          <div class="form-field">
            <label for="login-password">Password:</label>
            <input id="login-password" type="password" formControlName="password">
          </div>

          <button type="submit">Confirm</button>
        </form>
      }
      @else {
        <form [formGroup]="register">
          <div class="form-field">
            <label for="register-username">Username:</label>
            <input id="register-username" type="text" formControlName="username">
          </div>

          <div class="form-field">
            <label for="register-email">Email:</label>
            <input id="register-email" type="email" formControlName="email">
          </div>

          <div class="form-field">
            <label for="register-password">Password:</label>
            <input id="register-password" type="password" formControlName="password">
          </div>

          <div class="form-field">
            <label for="register-confirm-password">Confirm Password:</label>
            <input id="register-confirm-password" type="password" formControlName="confirmPassword">
          </div>

          <button type="submit">Confirm</button>
        </form>
      }
    </section>
  `,
  styleUrl: './authentication.css'
})
export class AuthenticationComponent {
  selectedForm = "Register";
  login!: FormGroup;
  register!: FormGroup;

  tabSwitch(tab: string){
    this.selectedForm = tab;
  }

  ngOnInit(){
    this.login = new FormGroup(
      {
        email: new FormControl('', {nonNullable: true}),
        password: new FormControl('', {nonNullable: true})
      }
    )

    this.register = new FormGroup(
      {
        username: new FormControl('', {nonNullable: true}),
        email: new FormControl('', {nonNullable: true}),
        password: new FormControl('', {nonNullable: true}),
        confirmPassword: new FormControl('', {nonNullable: true})
      }
    )
  }

}
