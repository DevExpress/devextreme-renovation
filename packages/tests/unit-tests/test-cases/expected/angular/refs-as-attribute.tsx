import HelperWidget, { DxHelperWidgetModule } from "./refs-as-attribute-helper";

import { Injectable, Input } from "@angular/core";
@Injectable()
class WidgetProps {
  @Input() refProp?: HTMLDivElement;
  @Input() forwardRefProp?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
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
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { UndefinedNativeElementRef } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["refProp", "forwardRefProp"],
  template: `<ng-template #widgetTemplate
    ><div
      ><dx-helper-widget
        [forwardRef]="forwardRef?.nativeElement"
        [someRef]="someRef?.nativeElement"
        [refProp]="refProp"
        [forwardRefProp]="
          forwardRefProp ? forwardRefProp()?.nativeElement : undefined
        "
        #helperwidget1
        style="display: contents"
      ></dx-helper-widget
      ><ng-content
        *ngTemplateOutlet="helperwidget1?.widgetTemplate"
      ></ng-content></div
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
  @ViewChild("someRefLink", { static: false })
  __someRef!: ElementRef<HTMLDivElement>;
  get someRef(): ElementRef<HTMLDivElement> {
    return this.__someRef
      ? this.__someRef
      : new UndefinedNativeElementRef<HTMLDivElement>();
  }
  forwardRef: ElementRef<HTMLDivElement> =
    new UndefinedNativeElementRef<HTMLDivElement>();
  get __forwardRefCurrent(): any {
    return this.forwardRef?.nativeElement;
  }
  get __restAttributes(): any {
    return {};
  }
  forwardRefProp__Ref__?: ElementRef<HTMLDivElement>;
  get forwardRef_forwardRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_forwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRef"];
    }
    return (this.__getterCache["forwardRef_forwardRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          if (ref) {
            this.forwardRef = ref;
          } else {
            this.forwardRef = new UndefinedNativeElementRef();
          }
        }
        return this.forwardRef;
      }.bind(this);
    })());
  }
  get forwardRef_forwardRefProp(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_forwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRefProp"];
    }
    return (this.__getterCache["forwardRef_forwardRefProp"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          if (ref) {
            this.forwardRefProp__Ref__ = ref;
          } else {
            this.forwardRefProp__Ref__ = new UndefinedNativeElementRef();
          }
          this.forwardRefProp?.(this.forwardRefProp__Ref__);
        }
        return this.forwardRefProp?.();
      }.bind(this);
    })());
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    forwardRef_forwardRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
    forwardRef_forwardRefProp?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

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
  imports: [DxHelperWidgetModule, CommonModule],
  entryComponents: [HelperWidget],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
