import { Component, inject, input } from "@angular/core";
import { ParkingLotService } from "../services/parking-lot-service";
import { User } from "../interfaces/user";
import { ParkingLot } from "../interfaces/parkinglot";
import { EmployeeCardComponent } from "../employee-card/employee-card";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, from, switchMap, tap } from "rxjs";
import { UserService } from "../services/user-service";

@Component({
  selector: 'app-manage-employees',
  imports: [ReactiveFormsModule, EmployeeCardComponent],
  template:`
    <section class="hidden-scroll">
      <div class="user-search">
        <input class="search-bar"
        [formControl]="search"
        placeholder="Search by name/email">
        @if(searchSuggestions.length > 0) {
          <ul class="suggestion-list">
            @for (user of searchSuggestions; track user.id) {
              <li (click)="addEmployee(user)">
                {{user.username}} ({{ user.email }})
              </li>
            }
          </ul>
        }
      </div>
      <div class="employee-list">
        @for(employee of employees; track employee.id){
          <app-employee-card [employee]="employee" [currentParkingLot]="currentParkingLot()"/>
        }
      </div>
    </section>
  `,
  styleUrls:['manage-employees.css'],
})
export class ManageEmployeesComponent{
  parkingLotService = inject(ParkingLotService);
  userService = inject(UserService);
  employees: User[] = [];
  currentParkingLot = input.required<ParkingLot>();
  search = new FormControl('');
  searchSuggestions: User[] =[];

  async ngOnInit(){
    this.loadEmployees();

    this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => {
        if(!value || value.length <= 2){
          this.searchSuggestions = [];
        }
      }),
      filter(value => !!value && value.length > 2),
      switchMap(value =>
        from(this.userService.getSearchSuggestions(value, this.currentParkingLot().id))
      )
    ).subscribe(users => {
      this.searchSuggestions = users;
    });
  }

  async loadEmployees(){
    const parkingLotId = this.currentParkingLot().id;
    this.employees = await this.parkingLotService.getAllEmployees(parkingLotId);
  }

  async addEmployee(user: User){
    await this.parkingLotService.addEmployee(this.currentParkingLot().id, user.id);
    this.search.setValue('');
    this.searchSuggestions = [];
    this.loadEmployees();
  }
}
