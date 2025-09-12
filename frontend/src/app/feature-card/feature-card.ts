import { Component, input } from '@angular/core';
import { FeatureInfo } from '../interfaces/featureinfo';

@Component({
  selector: 'app-feature-card',
  imports: [],
  template: `
    <section>
      <h1>{{ featureInfo().mainText }}</h1>
      <p>{{ featureInfo().subText }}</p>
    </section>
  `,
  styleUrl: './feature-card.css'
})
export class FeatureCardComponent {
  featureInfo = input.required<FeatureInfo>();
}
