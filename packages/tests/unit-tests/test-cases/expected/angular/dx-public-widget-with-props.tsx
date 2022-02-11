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
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-public-widget-with-props",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["value", "optionalValue", "number"],
  outputs: ["onClick"],
  template: `<ng-template #widgetTemplate
      ><div>{{ optionalValue || value }}</div></ng-template
    >
    <ng-container
      *ngTemplateOutlet="_private ? null : widgetTemplate"
    ></ng-container>`,
})
export class PublicWidgetWithProps extends WidgetWithPropsInput {
  defaultEntries: DefaultEntries;

  @Input() _private = false;
  doSomething(): any {}
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    this._elementRef.nativeElement.removeAttribute("id");
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  _onClick: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>
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
  declarations: [PublicWidgetWithProps],
  imports: [CommonModule],

  exports: [PublicWidgetWithProps],
})
export class DxPublicWidgetWithPropsModule {}
export { PublicWidgetWithProps as DxPublicWidgetWithPropsComponent };
export default PublicWidgetWithProps;
