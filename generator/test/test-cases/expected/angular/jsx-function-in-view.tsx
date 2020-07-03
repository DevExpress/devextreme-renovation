import { Input } from "@angular/core";
export class WidgetInput {
  @Input() loading: boolean = true;
  @Input() greetings: string = "Hello";
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `
    <div>
      <ng-container *ngIf="loading">
        <div>{{ __loadingProps.text }}</div>
      </ng-container>
      <ng-container *ngIf="!loading">
        <span>{{ "" + greetings + " " + __name + "" }}</span>
      </ng-container>
    </div>
  `,
})
export default class Widget extends WidgetInput {
  get __loadingProps(): any {
    return { text: "Loading..." };
  }
  get __name(): any {
    return "User";
  }
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
