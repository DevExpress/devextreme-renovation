import { Component, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  @ViewChild('someRef') someRef: ElementRef<HTMLInputElement> | null = null;
  title = "my-app";
  counterValue = 15;
}
