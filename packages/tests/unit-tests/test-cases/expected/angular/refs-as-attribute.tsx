import { Input } from "@angular/core";
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
  ViewRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["refProp", "forwardRefProp"],
  template: `<div
    ><div
      [someArg1]="forwardRef?.nativeElement"
      [someArg2]="someRef?.nativeElement"
      [someArg3]="refProp"
      [someArg4]="forwardRefProp ? forwardRefProp()?.nativeElement : undefined"
    ></div
  ></div>`,
})
export default class Widget extends WidgetProps {
  @ViewChild("someRef", { static: false }) someRef?: ElementRef<HTMLDivElement>;
  forwardRef?: ElementRef<HTMLDivElement>;
  get __forwardRefCurrent(): any {
    return this.forwardRef?.nativeElement;
  }
  get __restAttributes(): any {
    return {};
  }
  forwardRefPropRef?: ElementRef<HTMLDivElement>;
  get forwardRef_forwardRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_forwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRef"];
    }
    return (this.__getterCache["forwardRef_forwardRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          this.forwardRef = ref;
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
          this.forwardRefPropRef = ref;
          this.forwardRefProp?.(ref);
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
    ) => ElementRef<HTMLDivElement> | undefined;
    forwardRef_forwardRefProp?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

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
