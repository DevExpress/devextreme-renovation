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
  imports: [DxPublicWidgetWithPropsModule, CommonModule],
  entryComponents: [PublicWidgetWithProps],
  exports: [WidgetWithProps],
})
export class DxWidgetWithPropsModule {}
export { WidgetWithProps as DxWidgetWithPropsComponent };
export default WidgetWithProps;

import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-public-widget-with-props",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["value", "optionalValue", "number"],
  outputs: ["onClick"],
  template: `<div>{{ optionalValue || value }}</div>`,
})
export class PublicWidgetWithProps extends WidgetWithPropsInput {
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
  declarations: [PublicWidgetWithProps],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [PublicWidgetWithProps],
})
export class DxPublicWidgetWithPropsModule {}
export { PublicWidgetWithProps as DxPublicWidgetWithPropsComponent };
export default PublicWidgetWithProps;
