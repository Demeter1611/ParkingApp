import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  readonly version = signal(0);

  notify() {
    this.version.update(v => v + 1);
  }
}