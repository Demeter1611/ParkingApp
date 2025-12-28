import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-nav-sidebar',
  imports: [NgClass, FontAwesomeModule],
  template: `
    <section>
      <button class="tab-header" (click)="expandTab('Parking')">
        Parking
        <fa-icon [icon]="currentlyExpandedTabs.includes('Parking') ? faAngleUp : faAngleDown"></fa-icon>
      </button>
      <ul class="expanded-options" [ngClass]="{'shown': currentlyExpandedTabs.includes('Parking')}">
        <li>Manage parking lots</li>
        <li>View parking lots</li>
        <li>Assign ownership of spots</li>
      </ul>

      <button class="tab-header" (click)="expandTab('Employees')">
        Employees
        <fa-icon [icon]="currentlyExpandedTabs.includes('Employees') ? faAngleUp : faAngleDown"></fa-icon>
      </button>
      <ul class="expanded-options" [ngClass]="{'shown': currentlyExpandedTabs.includes('Employees')}">
        <li>Add / edit / remove employees</li>
      </ul>

      <button class="tab-header" (click)="expandTab('Reports & Logs')">
        Reports & Logs
        <fa-icon [icon]="currentlyExpandedTabs.includes('Reports & Logs') ? faAngleUp : faAngleDown"></fa-icon>
      </button>
      <ul class="expanded-options" [ngClass]="{'shown': currentlyExpandedTabs.includes('Reports & Logs')}">
        <li>Usage of spots</li>
        <li>Log of actions</li>
      </ul>
    </section>
  `,
  styleUrl: './nav-sidebar.css'
})
export class NavSidebar {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  currentlyExpandedTabs: string[] = [];
  expandTab(tab: string){
    const index = this.currentlyExpandedTabs.indexOf(tab);
    if(index !== -1){
      this.currentlyExpandedTabs.splice(index, 1);
      return;
    }
    this.currentlyExpandedTabs.push(tab);
  }
}
