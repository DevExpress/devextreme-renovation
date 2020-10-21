import { Input } from "@angular/core";
class WidgetProps {
  @Input() outerDivRef?: (ref: any) => void;
  @Input() refProp?: HTMLDivElement;
  @Input() forwardRefProp?: (ref: any) => void;
  @Input() requiredRefProp!: HTMLDivElement;
  @Input() requiredForwardRefProp!: (ref: any) => void;
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
    someRef = this.refProp ? this.refProp : this.divRef.nativeElement;
    if (this.forwardRefProp) {
      this.forwardRef_forwardRefProp(new ElementRef(this.divRef.nativeElement));
    }
    this.forwardRefProp &&
      this.forwardRef_forwardRefProp(new ElementRef(this.divRef.nativeElement));
    someRef = this.forwardRefPropRef?.nativeElement
      ? this.forwardRefPropRef?.nativeElement
      : this.divRef.nativeElement;
    if (!this.ref) {
      this.ref = new ElementRef(this.divRef.nativeElement);
    }
    !this.ref && (this.ref = new ElementRef(this.divRef.nativeElement));
    someRef = this.ref?.nativeElement
      ? this.ref?.nativeElement
      : this.divRef.nativeElement;
    if (!this.forwardRef) {
    }
    if (this.forwardRefProp) {
      this.forwardRef_forwardRefProp(new ElementRef(this.divRef.nativeElement));
    }
    someRef = this.forwardRef?.nativeElement
      ? this.forwardRef?.nativeElement
      : this.divRef.nativeElement;
    this.existingRef = new ElementRef(this.divRef.nativeElement);
    this.forwardRef_requiredForwardRefProp(
      new ElementRef(this.divRef.nativeElement)
    );
  }
  __readRefs(): any {
    const outer_1 = this.refProp?.outerHTML;
    const outer_2 = this.forwardRefPropRef?.nativeElement?.outerHTML;
    const outer_3 = this.ref?.nativeElement?.outerHTML;
    const outer_4 = this.forwardRef?.nativeElement?.outerHTML;
    const outer_5 = this.existingRef.nativeElement.outerHTML;
    const outer_6 = this.existingForwardRef.nativeElement.outerHTML;
    const outer_7 = this.requiredRefProp.outerHTML;
    const outer_8 = this.requiredForwardRefPropRef.nativeElement.outerHTML;
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("outerDivRefRef", { static: false }) outerDivRefRef?: ElementRef<
    HTMLDivElement
  >;
  @ViewChild("forwardRefPropRef", { static: false })
  forwardRefPropRef?: ElementRef<HTMLDivElement>;
  @ViewChild("requiredForwardRefPropRef", { static: false })
  requiredForwardRefPropRef!: ElementRef<HTMLDivElement>;
  get forwardRef_forwardRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_forwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRef"];
    }
    return (this.__getterCache["forwardRef_forwardRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.forwardRef = ref;

        return ref;
      };
    })());
  }
  get forwardRef_existingForwardRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_existingForwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_existingForwardRef"];
    }
    return (this.__getterCache["forwardRef_existingForwardRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.existingForwardRef = ref;

        return ref;
      };
    })());
  }
  get forwardRef_outerDivRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_outerDivRef"] !== undefined) {
      return this.__getterCache["forwardRef_outerDivRef"];
    }
    return (this.__getterCache["forwardRef_outerDivRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.outerDivRefRef = ref;
        this.outerDivRef?.(ref);
        return ref;
      };
    })());
  }
  get forwardRef_forwardRefProp(): (ref: any) => void {
    if (this.__getterCache["forwardRef_forwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRefProp"];
    }
    return (this.__getterCache["forwardRef_forwardRefProp"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.forwardRefPropRef = ref;
        this.forwardRefProp?.(ref);
        return ref;
      };
    })());
  }
  get forwardRef_requiredForwardRefProp(): (ref: any) => void {
    if (this.__getterCache["forwardRef_requiredForwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_requiredForwardRefProp"];
    }
    return (this.__getterCache["forwardRef_requiredForwardRefProp"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.requiredForwardRefPropRef = ref;
        this.requiredForwardRefProp(ref);
        return ref;
      };
    })());
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    forwardRef_forwardRef?: (ref: any) => void;
    forwardRef_existingForwardRef?: (ref: any) => void;
    forwardRef_outerDivRef?: (ref: any) => void;
    forwardRef_forwardRefProp?: (ref: any) => void;
    forwardRef_requiredForwardRefProp?: (ref: any) => void;
  } = {};

  ngAfterViewInit() {
    this.outerDivRef?.(this.outerDivRefRef);

    this.forwardRefProp?.(this.forwardRefPropRef);

    this.requiredForwardRefProp(this.requiredForwardRefPropRef);
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
