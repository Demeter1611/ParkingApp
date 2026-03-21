import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  showTopbar = signal(true);
  title = signal("");
  transparentBackground = signal(false);

  updateTopbar(data: {showTopbar?: boolean, title?: string, breadcrumbs?: string[], transparentBackground?: boolean}){
    this.showTopbar.set(data.showTopbar ?? true);
    this.title.set(data.title ?? "");
    this.transparentBackground.set(data.transparentBackground ?? false);
  }
}
