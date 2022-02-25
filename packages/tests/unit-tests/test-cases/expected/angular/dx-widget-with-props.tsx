import { Component, Input, Output, EventEmitter } from "@angular/core";
@Component({
  template: "",
})
export class WidgetWithPropsInput {
  @Input() value: string = "default text";
  @Input() optionalValue?: string;
  @Input() number?: number = 42;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
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
  selector: "dx-widget-with-props",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["value", "optionalValue", "number"],
  outputs: ["onClick"],
  template: `<ng-template #widgetTemplate
    ><div>{{ optionalValue || value }}</div></ng-template
  >`,
})
export class WidgetWithProps extends WidgetWithPropsInput {
  defaultEntries: DefaultEntries;
  doSomething(): any {}
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

  _onClick: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetWithPropsInput() as { [key: string]: any };
    this.defaultEntries = ["value", "number"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
  }
}
@NgModule({
  declarations: [WidgetWithProps],
  imports: [CommonModule],

  exports: [WidgetWithProps],
})
export class DxWidgetWithPropsModule {}
export { WidgetWithProps as DxWidgetWithPropsComponent };
export default WidgetWithProps;
