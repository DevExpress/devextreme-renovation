import { Input } from "@angular/core";
export class WidgetInput {
  __loadingInternalValue?: boolean = true;
  @Input()
  set loading(value: boolean | undefined) {
    if (value !== undefined) this.__loadingInternalValue = value;
    else this.__loadingInternalValue = true;
  }
  get loading() {
    return this.__loadingInternalValue;
  }

  __greetingsInternalValue?: string = "Hello";
  @Input()
  set greetings(value: string | undefined) {
    if (value !== undefined) this.__greetingsInternalValue = value;
    else this.__greetingsInternalValue = "Hello";
  }
  get greetings() {
    return this.__greetingsInternalValue;
  }
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
    private renderer: Renderer2,
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
