import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FeatureInfo } from '../interfaces/featureinfo';
import { FeatureCardComponent } from "../feature-card/feature-card";


@Component({
  selector: 'app-feature-display',
  imports: [NgClass, FeatureCardComponent],
  template:`
    <section>
      <div class="tab-button-container">
        <button class="primary-button tab" [ngClass]="{'active': selectedTab === 'Employee'}" (click)="tabSwitch('Employee')">Employee</button>
        <button class="primary-button tab" [ngClass]="{'active': selectedTab === 'Administrator'}" (click)="tabSwitch('Administrator')">Administrator</button>
      </div>
      <div class="feature-container">
        @if (selectedTab == 'Employee') {
          @for(feature of employeeFeatures; track $index) {
            <app-feature-card [featureInfo] = "feature"/>
          }
        }
        @else if (selectedTab == 'Administrator'){
          @for(feature of administratorFeatures; track $index) {
            <app-feature-card [featureInfo] = "feature"/>
          }
        }
      </div>
    </section>

  `,
  styleUrl: './feature-display.css'
})
export class FeatureDisplayComponent {
  selectedTab = "Employee";

  tabSwitch(tab: string){
    this.selectedTab = tab;
  }

  employeeFeatures: FeatureInfo[] = [
    {
      mainText: 'Find Your Spot, Instantly.',
      subText: 'See the live status of every parking space on an interactive map. Quickly identify available, reserved, or shared spots without guessing or circling the lot.'
    },
    {
      mainText: 'Reserve Your Parking in Seconds.',
      subText: 'Book a spot for a day, a week, or a specific time slot using a simple calendar. Confirm your reservation in just a few clicks, and receive reminders before your booking expires'
    },
    {
      mainText: 'Share and Gain Access, Fairly.',
      subText: 'Send or accept donation requests, claim temporarily free spots, and receive instant notifications about approvals, expirations, or opportunities that match your parking preferences.'
    }
  ]

  administratorFeatures: FeatureInfo[] = [
    {
      mainText:'Manage Users & Parking Spots Effortlessly',
      subText:'Add, edit, or remove employee accounts in seconds. Oversee multiple locations—all from one clean dashboard.'
    },
    {
      mainText:'Get Actionable Insights & Reports',
      subText:'Access detailed analytics on reservations, donations, and underused spaces. Identify trends, optimize utilization, and make smarter parking policies.'
    },
    {
      mainText:'Design & Organize Parking Layouts Visually',
      subText:'Use intuitive drawing tools to create accurate parking maps, duplicate rows for efficiency, manage multiple floors, and keep layouts up-to-date with drag-and-drop simplicity.'
    }
  ]
}
