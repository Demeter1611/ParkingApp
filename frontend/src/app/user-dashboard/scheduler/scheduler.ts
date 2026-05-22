import { Component, inject, input, output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { ParkingSpotService } from "../../services/parking-spot-service";
import { ParkingSpot } from "../../interfaces/parkingspot";

interface DayInfo{
  status: string,
  spotId: number
}

interface CalendarDay{
  dayNumber: number | null;
  dayInfo?: DayInfo;
}

@Component({
  selector: 'app-scheduler',
  template: `
    <section class="scheduler no-select" (mouseup)="finishSelection()" (contextmenu)="cancelSelection($event)">
      <div class='month-selector'>
        <mat-icon (click)="onPrev()" class="action-icon">arrow_back</mat-icon>
        <h2 class='month-name'>{{monthNames[currentMonth]}} {{currentYear}}</h2>
        <mat-icon (click)="onNext()" class="action-icon">arrow_forward</mat-icon>
      </div>
      <div class="calendar-grid">
        @for(dayName of daysOfWeek; track $index){
          <span class="calendar-header-text">{{dayName}}</span>
        }
        @for(cell of calendarCells; track $index){
          <div class="day-number"
          [class.invisible]="cell.dayNumber === null"
          [class.is-past]="isPastDate(cell.dayNumber)"
          [class.is-today]="isToday(cell.dayNumber)"
          [class.selected]="isInRange(cell.dayNumber)"
          [class.invalid-selection]="cell.dayInfo?.status !== initialSelectionStatus && selectionStart"
          (mousedown)="startSelection($event, cell)"
          (mouseenter)="updateSelection(cell.dayNumber)">
            <span class="day-info-circle"
            [class.allocated]="cell.dayInfo?.status === 'allocated'"
            [class.released]="cell.dayInfo?.status === 'released'"
            [class.reserved]="cell.dayInfo?.status === 'reserved'"
            [class.occupied]="cell.dayInfo?.status === 'occupied'"></span>
            {{cell.dayNumber}}
          </div>
        }
      </div>
      <div class="color-legend">
        <div class="legend-item">
          <span class="legend-circle reserved"></span>
          Reserved
        </div><div class="legend-item">
          <span class="legend-circle allocated"></span>
          Allocated
        </div>
        <div class="legend-item">
          <span class="legend-circle occupied"></span>
          Occupied
        </div>
        <div class="legend-item">
          <span class="legend-circle released"></span>
          Released
        </div>
      </div>
      <div class="action-buttons">
        @if(selectionStart && selectionEnd){
          @if(initialSelectionStatus === 'allocated' || initialSelectionStatus === 'reserved'){
            <button (click)="onRelease()">Release spot</button>
          }
          @else if(initialSelectionStatus === 'released'){
            <button (click)="onReclaim()">Reclaim spot</button>
          }
          @else {
            <button (click)="onRequest()">Make request</button>
          }
        }
      </div>
    </section>
  `,
  styleUrls: ['scheduler.css'],
  imports: [MatIcon]
}) export class Scheduler{
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ]
  daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
  parkingSpotService = inject(ParkingSpotService);
  mySpot = input<ParkingSpot | null>();
  openMakeRequest = output<{startDate: Date, endDate: Date}>();

  calendarCells: CalendarDay[] = [];
  currentMonth: number;
  currentYear: number;

  isDragging = false;
  selectionStart: number | null = null;
  initialSelectionStatus: string | null = null;
  selectionEnd: number | null = null;
  finalSelection: {start: number, end: number} | null = null;

  async generateCalendar(year: number, month: number){
    this.calendarCells = Array.from({ length: 42 }, () => ({ dayNumber: null}));

    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthData = await this.parkingSpotService.getMonthData(new Date(year, month, 1), new Date(year, month, daysInMonth));
    const statusMap = await this.createStatusMap(monthData);


    let dayIterator = 1;
    for(let i = firstDayOffset; i < firstDayOffset + daysInMonth; i++){
      const dateKey = this.formatDateKey(new Date(year, month, dayIterator));
      const infoForThisDay = statusMap.get(dateKey) || statusMap.get('default') || undefined;
      this.calendarCells[i] = {
        dayNumber: dayIterator++,
        dayInfo: infoForThisDay
      }
    };
  }

  async createStatusMap(monthData: any[]){
    const map: Map<string, DayInfo> = new Map();
    const defaultSpot = monthData.find(item => item.status === 'allocated');
    if(defaultSpot){
      map.set('default', {
        spotId: defaultSpot.spotId,
        status: 'allocated'
      })
    }

    monthData.forEach(item => {
      if(item.status !== 'allocated' && item.startDate && item.endDate) {
        let current = new Date(item.startDate);
        let end = new Date(item.endDate);
        while(current <= end){
          const dateKey = this.formatDateKey(current);
          map.set(dateKey, {
            spotId: item.spotId,
            status: item.status
          });
          current.setDate(current.getDate() + 1);
        }
      }
    })
    return map;
  }

  formatDateKey(date: Date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }

  constructor(){
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  isPastDate(day: number | null): boolean {
    if (day === null){
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cellDate = new Date(this.currentYear, this.currentMonth, day);

    return cellDate < today;
  }

  isToday(day: number | null){
    const today = new Date();
    return day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear();
  }

  onNext(){
    if(this.currentMonth === 11){
      this.currentMonth = 0;
      this.currentYear++;
    } else{
      this.currentMonth++;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  onPrev(){
    if(this.currentMonth === 0){
      this.currentMonth = 11;
      this.currentYear--;
    } else{
      this.currentMonth--;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  startSelection(event: MouseEvent, cell: CalendarDay | null){
    if (event.button !== 0 || !cell || this.isPastDate(cell.dayNumber)){
      return;
    }
    this.isDragging = true;
    this.selectionStart = cell.dayNumber;
    this.initialSelectionStatus = cell?.dayInfo?.status || null;
    this.selectionEnd = cell.dayNumber;
  }

  updateSelection(day: number | null){
    if(this.isDragging && day && !this.isPastDate(day)){
      this.selectionEnd = day;
    }
  }

  finishSelection() {
    this.isDragging = false;
    if(this.selectionStart && this.selectionEnd){
      this.finalSelection = this.getOrderedRange();
    }
    console.log(this.finalSelection);
  }

  private getOrderedRange(){
    return {
      start: Math.min(this.selectionStart!, this.selectionEnd!),
      end: Math.max(this.selectionStart!, this.selectionEnd!)
    }
  }

  isInRange(day: number | null): boolean{
    if(!day || !this.selectionStart || !this.selectionEnd){
      return false;
    }
    const min = Math.min(this.selectionStart, this.selectionEnd);
    const max = Math.max(this.selectionStart, this.selectionEnd);
    return day >= min && day <= max;
  }

  cancelSelection(event: MouseEvent){
    event.preventDefault();

    this.selectionStart= null;
    this.selectionEnd = null;
    this.finalSelection = null;
    this.isDragging = false;
  }

  private getFinalSelectionDates(){
    if(!this.finalSelection){
      return;
    }
    return {
      startDate: new Date(this.currentYear, this.currentMonth, this.finalSelection.start + 1),
      endDate: new Date(this.currentYear, this.currentMonth, this.finalSelection.end + 1)
    }
  }

  async onRelease(){
    const operationDate = this.getFinalSelectionDates();
    if(!operationDate){
      return;
    }
    const response = await this.parkingSpotService.releaseSpot(this.mySpot()!.id, operationDate);
    if(!response.error){
      this.selectionStart = null;
      this.selectionEnd = null;
      this.finalSelection = null;
    }
  }

  async onReclaim(){
    const operationDate = this.getFinalSelectionDates();
    if(!operationDate){
      return;
    }
    const response = await this.parkingSpotService.reclaimSpot(this.mySpot()!.id, operationDate);
    if(!response.error){
      this.selectionStart = null;
      this.selectionEnd = null;
      this.finalSelection = null;
    }
  }

  async onRequest(){
    const operationDate = this.getFinalSelectionDates();
    if(!operationDate){
      return;
    }

    this.openMakeRequest.emit(operationDate);
  }
}
