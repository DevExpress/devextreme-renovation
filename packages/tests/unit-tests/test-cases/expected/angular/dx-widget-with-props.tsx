import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
export class WidgetWithPropsInput {
  @Input() value: string = "default text";
  @Input() optionalValue?: string;
  @Input() number?: number = 42;
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
  propsDefaults = new WidgetWithPropsInput();
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

  ngOnChanges(changes: { [name: string]: any }) {
    if (changes["value"] && changes["value"].currentValue === undefined) {
      this.value = this.propsDefaults.value;
    }
    if (changes["number"] && changes["number"].currentValue === undefined) {
      this.number = this.propsDefaults.number;
    }
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
