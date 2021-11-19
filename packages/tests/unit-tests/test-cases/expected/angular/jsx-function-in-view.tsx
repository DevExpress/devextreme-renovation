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
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["loading", "greetings"],
  template: `<ng-template #widgetTemplate
    ><div
      ><ng-container *ngIf="loading"
        ><div>{{ __loadingProps.text }}</div></ng-container
      >
      <ng-container *ngIf="!loading"
        ><span>{{ "" + greetings + " " + __name + "" }}</span></ng-container
      ></div
    ></ng-template
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
