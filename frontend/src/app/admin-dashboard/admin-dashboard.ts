import { Component, inject, ViewEncapsulation } from "@angular/core";
import { ParkingLotViewComponent } from "../parking-lot-view/parking-lot-view";
import ManageParkingLotsComponent from "./parking-lot-selector/manage-parking-lots";
import { TopbarService } from "../services/topbar-service";

@Component({
  selector: 'app-admin-dashboard',
  template:`
  <section class="admin-dashboard">
     <app-manage-parking-lots/>
  </section>
  `,
  styleUrls: ['admin-dashboard.css'],
  imports: [ParkingLotViewComponent, ManageParkingLotsComponent]
})
export class AdminDashboardComponent {
  topbarService = inject(TopbarService);
  ngOnInit(){
    this.topbarService.updateTopbar({showTopbar: true, title:"Admin Dashboard"});
  }
}
