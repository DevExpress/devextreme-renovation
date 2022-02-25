import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class WidgetInput {
  @Input() loading: boolean = true;
  @Input() greetings: string = "Hello";
}

import {
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

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
  defaultEntries: DefaultEntries;
  get __loadingProps(): any {
    return { text: "Loading..." };
  }
  get __name(): any {
    return "User";
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ["loading", "greetings"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
