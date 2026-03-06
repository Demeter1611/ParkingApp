import { Component, inject } from "@angular/core";
import { TopbarService } from "../services/topbar-service";

@Component({
  selector: 'app-topbar',
  template:`
  @if(topbarService.showTopbar()){
    <section class="topbar" [class.with-bg]="!topbarService.transparentBackground()">
      <div class="navigation">
        <h1 class="title">{{topbarService.title()}}</h1>
        @if(topbarService.breadcrumbs().length > 0){
          <div class="navigation-breadcrumbs">
            @for(crumb of topbarService.breadcrumbs(); track $index){
              <h2 class="crumb">{{crumb}}</h2>
            }
          </div>
        }
      </div>
    </section>
  }
  `,
  styleUrls: ["topbar.css"],
}) export class Topbar{
  topbarService = inject(TopbarService);
}
