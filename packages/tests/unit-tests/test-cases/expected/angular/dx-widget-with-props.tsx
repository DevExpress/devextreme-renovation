import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
export class WidgetWithPropsInput {
  __valueInternalValue?: string = "default text";
  @Input()
  set value(value: string | undefined) {
    if (value !== undefined) this.__valueInternalValue = value;
    else this.__valueInternalValue = "default text";
  }
  get value() {
    return this.__valueInternalValue;
  }
  @Input() optionalValue?: string;

  __numberInternalValue?: number = 42;
  @Input()
  set number(value: number | undefined) {
    if (value !== undefined) this.__numberInternalValue = value;
    else this.__numberInternalValue = 42;
  }
  get number() {
    return this.__numberInternalValue;
  }
  @Output() onClick: EventEmitter<any> = new EventEmitter();
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
  selector: "dx-widget-with-props",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["value", "optionalValue", "number"],
  outputs: ["onClick"],
  template: `<ng-template #widgetTemplate
    ><div>{{ optionalValue || value }}</div></ng-template
  >`,
})
export class WidgetWithProps extends WidgetWithPropsInput {
  doSomething(): any {}
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
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
