import { Input } from "@angular/core";
export class WidgetInput {
  @Input() loading: boolean = true;
  @Input() greetings: string = "Hello";
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["loading", "greetings"],
  template: `<div
    ><ng-container *ngIf="loading"
      ><div>{{ __loadingProps.text }}</div></ng-container
    >
    <ng-container *ngIf="!loading"
      ><span>{{ "" + greetings + " " + __name + "" }}</span></ng-container
    ></div
  >`,
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
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
