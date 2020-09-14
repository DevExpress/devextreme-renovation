import { Input } from "@angular/core";
class WidgetProps {
  @Input() outerDivRef: (ref: any) => void = () => {};
  @Input() refProp!: HTMLDivElement;
  @Input() forwardRefProp: (ref: any) => void = () => {};
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
  @ViewChild("ref", { static: false }) ref!: ElementRef<HTMLDivElement>;
  forwardRef!: ElementRef<HTMLDivElement>;
  __writeRefs(): any {
    this.refProp = this.divRef.nativeElement;
    this.forwardRef_forwardRefProp(new ElementRef(this.divRef.nativeElement));
    this.forwardRefProp(new ElementRef(this.divRef.nativeElement));
    this.ref = new ElementRef(this.divRef.nativeElement);
    this.forwardRef = new ElementRef(this.divRef.nativeElement);
  }
  __readRefs(): any {
    const outer_1 = this.refProp.outerHTML;
    const outer_2 = this.forwardRefPropRef.nativeElement.outerHTML;
    const outer_3 = this.ref.nativeElement.outerHTML;
    const outer_4 = this.forwardRef.nativeElement.outerHTML;
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("outerDivRefRef", { static: false }) outerDivRefRef?: ElementRef<
    HTMLDivElement
  >;
  @ViewChild("forwardRefPropRef", { static: false })
  forwardRefPropRef!: ElementRef<HTMLDivElement>;
  get forwardRef_forwardRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_forwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRef"];
    }
    return (this.__getterCache["forwardRef_forwardRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => (this.forwardRef = ref);
    })());
  }
  get forwardRef_outerDivRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_outerDivRef"] !== undefined) {
      return this.__getterCache["forwardRef_outerDivRef"];
    }
    return (this.__getterCache["forwardRef_outerDivRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => (this.outerDivRefRef = ref);
    })());
  }
  get forwardRef_forwardRefProp(): (ref: any) => void {
    if (this.__getterCache["forwardRef_forwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRefProp"];
    }
    return (this.__getterCache["forwardRef_forwardRefProp"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => (this.forwardRefPropRef = ref);
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
    forwardRef_outerDivRef?: (ref: any) => void;
    forwardRef_forwardRefProp?: (ref: any) => void;
  } = {};

  ngAfterViewInit() {
    this.outerDivRef(this.outerDivRefRef);

    this.forwardRefProp(this.forwardRefPropRef);
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
