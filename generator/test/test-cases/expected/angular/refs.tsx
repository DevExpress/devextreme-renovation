import { Input } from "@angular/core";
class WidgetProps {
  @Input() outerDivRef?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
  @Input() refProp?: HTMLDivElement;
  @Input() forwardRefProp?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
  @Input() requiredRefProp!: HTMLDivElement;
  @Input() requiredForwardRefProp!: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement>;
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
  inputs: [
    "outerDivRef",
    "refProp",
    "forwardRefProp",
    "requiredRefProp",
    "requiredForwardRefProp",
  ],
  template: `<div #divRef><div #outerDivRefRef></div></div>`,
})
export default class Widget extends WidgetProps {
  @ViewChild("divRef", { static: false }) divRef!: ElementRef<HTMLDivElement>;
  @ViewChild("ref", { static: false }) ref?: ElementRef<HTMLDivElement>;
  forwardRef?: ElementRef<HTMLDivElement>;
  @ViewChild("existingRef", { static: false }) existingRef!: ElementRef<
    HTMLDivElement
  >;
  existingForwardRef!: ElementRef<HTMLDivElement>;
  __writeRefs(): any {
    let someRef;
    if (this.refProp) {
    }
    if (this.refProp) {
    }
    if (this.forwardRefProp) {
    }
    if (this.forwardRefProp?.()?.nativeElement) {
    }
    someRef = this.refProp ? this.refProp : this.divRef;
    if (this.forwardRefProp) {
      this.forwardRef_forwardRefProp(this.divRef);
    }
    this.forwardRefProp && this.forwardRef_forwardRefProp(this.divRef);
    someRef = this.forwardRefProp ? this.forwardRefProp : this.divRef;
    if (this.ref && !this.ref.nativeElement) {
      this.ref = new ElementRef(this.divRef.nativeElement);
    }
    this.ref &&
      !this.ref.nativeElement &&
      (this.ref = new ElementRef(this.divRef.nativeElement));
    someRef = this.ref?.nativeElement
      ? this.ref.nativeElement
      : this.divRef.nativeElement;
    if (this.forwardRef && !this.forwardRef.nativeElement) {
    }
    if (this.forwardRefProp) {
      this.forwardRef_forwardRefProp(this.divRef);
    }
    someRef = this.forwardRef
      ? this.forwardRef.nativeElement
      : this.divRef.nativeElement;
    this.existingRef = new ElementRef(this.divRef.nativeElement);
    this.forwardRef_requiredForwardRefProp(this.divRef);
  }
  __readRefs(): any {
    const outer_1 = this.refProp?.outerHTML;
    const outer_2 = this.forwardRefProp?.()?.nativeElement?.outerHTML;
    const outer_3 = this.ref?.nativeElement?.outerHTML;
    const outer_4 = this.forwardRef?.nativeElement?.outerHTML;
    const outer_5 = this.existingRef.nativeElement?.outerHTML;
    const outer_6 = this.existingForwardRef.nativeElement?.outerHTML;
    const outer_7 = this.requiredRefProp?.outerHTML;
    const outer_8 = this.requiredForwardRefProp?.().nativeElement?.outerHTML;
  }
  __getRestRefs(): {
    refProp?: HTMLDivElement | null;
    forwardRefProp?: HTMLDivElement | null;
    requiredRefProp: HTMLDivElement | null;
    requiredForwardRefProp: HTMLDivElement | null;
  } {
    const { outerDivRef, ...restProps } = {
      outerDivRef: this.outerDivRef,
      refProp: this.refProp,
      forwardRefProp: this.forwardRefProp,
      requiredRefProp: this.requiredRefProp,
      requiredForwardRefProp: this.requiredForwardRefProp,
    };
    return {
      refProp: restProps.refProp,
      forwardRefProp: restProps.forwardRefProp?.()?.nativeElement,
      requiredRefProp: restProps.requiredRefProp,
      requiredForwardRefProp: restProps.requiredForwardRefProp?.()
        .nativeElement,
    };
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("outerDivRefRef", { static: false }) outerDivRefRef?: ElementRef<
    HTMLDivElement
  >;
  forwardRefPropRef?: ElementRef<HTMLDivElement>;
  requiredForwardRefPropRef!: ElementRef<HTMLDivElement>;
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
  get forwardRef_existingForwardRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_existingForwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_existingForwardRef"];
    }
    return (this.__getterCache["forwardRef_existingForwardRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          this.existingForwardRef = ref!;
        }
        return this.existingForwardRef;
      }.bind(this);
    })());
  }
  get forwardRef_outerDivRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_outerDivRef"] !== undefined) {
      return this.__getterCache["forwardRef_outerDivRef"];
    }
    return (this.__getterCache["forwardRef_outerDivRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          this.outerDivRefRef = ref;
          this.outerDivRef?.(ref);
        }
        return this.outerDivRef?.();
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
  get forwardRef_requiredForwardRefProp(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_requiredForwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_requiredForwardRefProp"];
    }
    return (this.__getterCache["forwardRef_requiredForwardRefProp"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: Widget,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          this.requiredForwardRefPropRef = ref!;
          this.requiredForwardRefProp(ref);
        }
        return this.requiredForwardRefProp();
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
    forwardRef_existingForwardRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
    forwardRef_outerDivRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
    forwardRef_forwardRefProp?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
    forwardRef_requiredForwardRefProp?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
  } = {};

  ngAfterViewInit() {
    this.outerDivRef?.(this.outerDivRefRef);
  }

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
