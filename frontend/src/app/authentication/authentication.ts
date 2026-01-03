import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forbiddenPasswordValidator, matchingPasswordsValidator } from './validators';
import { AuthenticationService } from '../services/authentication-service';

@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule, NgClass],
  template: `
  <main class="hidden-scroll">
    <section class="auth-container">
      <div class="form-type-selectors">
        <button class="primary-button tab" [ngClass]="{'active': selectedForm === 'Login'}" (click)="tabSwitch('Login')">Login</button>
        <button class="primary-button tab" [ngClass]="{'active': selectedForm === 'Register'}" (click)="tabSwitch('Register')">Register</button>
      </div>
      @if(selectedForm === "Login") {
        <form [formGroup]="login">
          <div class="form-field">
            <label for="login-email">Email:</label>
            <input id="login-email" type="email" formControlName="email">
            @if(loginEmail?.touched && loginEmail?.invalid){
              <div class="error">
                @if(loginEmail?.hasError('required')){
                  <small>*Email required!</small>
                }
              </div>
            }
          </div>

          <div class="form-field">
            <label for="login-password">Password:</label>
            <input id="login-password" type="password" formControlName="password">
            @if(loginPassword?.touched && loginPassword?.invalid){
              <div class="error">
                <small *ngIf="reviewForm.invalid && reviewForm.touched">
                  All fields required!
                </small>
              </div>
            }
          </div>

          <button class="primary-button" type="submit" (click)="onLoginSubmit()">Confirm</button>
        </form>
      }
      @else {
        <form [formGroup]="register">
          <div class="form-field">
            <label for="register-username">Username:</label>
            <input id="register-username" type="text" formControlName="username">
            @if(registerUsername?.touched && registerUsername?.invalid){
              <div class="error">
                @if(registerUsername?.hasError('required')){
                  <small>*Username required!</small>
                }
                @if(registerUsername?.hasError('minlength')){
                  <small>*Username must be at least 5 characters long!</small>
                }
              </div>
            }

          </div>

          <div class="form-field">
            <label for="register-email">Email:</label>
            <input id="register-email" type="email" formControlName="email">
            @if(registerEmail?.touched && registerEmail?.invalid){
              <div class="error">
                @if(registerEmail?.hasError('required')){
                  <small>*Email required!</small>
                }
                @if(registerEmail?.hasError('email')){
                  <small>*Invalid email format!</small>
                }
              </div>
            }
          </div>

          <div class="form-field">
            <label for="register-password">Password:</label>
            <input id="register-password" type="password" formControlName="password">
            @if(registerPassword?.touched && registerEmail?.invalid){
              <div class="error">
                @if(registerPassword?.hasError('required')){
                  <small>*Password required!</small>
                }
                @if(registerPassword?.hasError('minlength')){
                  <small>*Password must be at least 8 characters long!</small>
                }
                @if(registerPassword?.hasError('forbiddenpassword')){
                  <small>*Password must contain a number!</small>
                }
              </div>
            }
          </div>

          <div class="form-field">
            <label for="register-confirm-password">Confirm Password:</label>
            <input id="register-confirm-password" type="password" formControlName="confirmPassword">
            @if(registerConfirmPassword?.touched && register.hasError('matchingpasswords')){
              <div class="error">
                <small>*Passwords don't match!</small>
              </div>
            }
          </div>
          <div class="form-field">
            <label>Role:</label>
            <select formControlName="role">
              <option value="user">User</option>
              <option value="parking">Parking</option>
            </select>
          </div>
          @if(registerRole?.touched && registerRole?.invalid){
            <div class="error">
              @if(registerRole?.hasError('required')){
                <small>*Role must be selected!</small>
              }
            </div>
          }
          <button class="primary-button" type="submit" (click)="onRegisterSubmit()">Confirm</button>
        </form>
      }
    </section>
  </main>
  `,
  styleUrl: './authentication.css'
})
export class AuthenticationComponent {
  authenticationService = inject(AuthenticationService);

  private router = inject(Router);

  selectedForm = "Login";
  login!: FormGroup;
  register!: FormGroup;


  tabSwitch(tab: string){
    this.selectedForm = tab;
  }

  ngOnInit(){
    this.login = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
        ]),
        password: new FormControl('', [
          Validators.required,
        ])
      }
    )

    this.register = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(5)
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          forbiddenPasswordValidator(),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
        ]),
        role: new FormControl('', [
          Validators.required,
        ])
      }, {
        validators: matchingPasswordsValidator
      }
    );
  }

  async onLoginSubmit(){
    this.login.markAllAsTouched();

    if(this.login.invalid){
      return;
    }

    const { email, password } = this.login.value;
    const response = await this.authenticationService.submitLoginRequest({
      email: email,
      password: password
    })

    if(!response.error){
      this.router.navigate(['/']);
    }

  }

  async onRegisterSubmit(){
    this.register.markAllAsTouched();

    if(this.register.invalid){
      return;
    }

    const {username, email, password, role} = this.register.value;

    const response = await this.authenticationService.submitRegisterRequest({
      username: username,
      email: email,
      password: password,
      role: role
    })

    if(!response.error){
      this.tabSwitch('Login');
      this.loginEmail?.patchValue(email);
      return;
    }
  }

  get registerUsername(){
    return this.register.get('username');
  }

  get registerEmail(){
    return this.register.get('email');
  }

  get registerPassword(){
    return this.register.get('password');
  }

  get registerConfirmPassword(){
    return this.register.get('confirmPassword');
  }

  get registerRole() {
    return this.register.get('role');
  }

  get loginEmail(){
    return this.login.get('email');
  }

  get loginPassword(){
    return this.login.get('password');
  }
}
