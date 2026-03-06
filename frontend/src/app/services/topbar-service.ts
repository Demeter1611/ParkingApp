import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  showTopbar = signal(true);
  title = signal("");
  breadcrumbs = signal<string[]>([]);
  transparentBackground = signal(false);

  updateTopbar(data: {showTopbar?: boolean, title?: string, breadcrumbs?: string[], transparentBackground?: boolean}){
    this.showTopbar.set(data.showTopbar ?? true);
    this.title.set(data.title ?? "");
    this.breadcrumbs.set(data.breadcrumbs ?? []);
    this.transparentBackground.set(data.transparentBackground ?? false);
  }
}
