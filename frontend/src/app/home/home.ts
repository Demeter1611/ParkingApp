import { TopbarService } from './../services/topbar-service';
import { Component, inject } from '@angular/core';
import { FeatureDisplayComponent } from "../feature-display/feature-display";

@Component({
  selector: 'app-homecomponent',
  imports: [FeatureDisplayComponent],
  template:`
    <section class="hidden-scroll no-select">
      <h1>Solving Parking Headaches <br> for Your Employees</h1>
      <p>Eliminate parking disputes with a platform that ensures fair access <br> and maximizes efficiency for every available spot</p>
      <app-feature-display/>
    </section>
  `,
  styleUrl: './home.css'
})
export class HomeComponent {
  topbarService = inject(TopbarService);
  ngOnInit(){
    this.topbarService.updateTopbar({showTopbar: true, title: ' Parking app', transparentBackground: true});
  }
}
