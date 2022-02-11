import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class Props {
  @Input() childRef!: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement>;
  @Input() nullableRef?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
  @Input() state?: number;
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
import { UndefinedNativeElementRef } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-ref-on-children-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["childRef", "nullableRef", "state"],
  template: `<ng-template #widgetTemplate
    ><div #childRef__Ref__><div #nullableRef__Ref__></div></div
  ></ng-template>`,
})
export default class RefOnChildrenChild extends Props {
  __method(): any {
    const nullableRefHtml = this.nullableRef?.()?.nativeElement?.innerHTML;
    if (this.nullableRef) {
      this.forwardRef_nullableRef(
        new ElementRef(this.childRef()?.nativeElement)
      );
    }
    return nullableRefHtml;
  }
  @ViewChild("childRef__Ref__", { static: false })
  childRef__Ref__!: ElementRef<HTMLDivElement>;
  @ViewChild("nullableRef__Ref__", { static: false })
  nullableRef__Ref__?: ElementRef<HTMLDivElement>;
  get forwardRef_childRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_childRef"] !== undefined) {
      return this.__getterCache["forwardRef_childRef"];
    }
    return (this.__getterCache["forwardRef_childRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: RefOnChildrenChild,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          if (ref) {
            this.childRef__Ref__ = ref;
          } else {
            this.childRef__Ref__ = new UndefinedNativeElementRef();
          }
          this.childRef(this.childRef__Ref__);
        }
        return this.childRef();
      }.bind(this);
    })());
  }
  get forwardRef_nullableRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_nullableRef"] !== undefined) {
      return this.__getterCache["forwardRef_nullableRef"];
    }
    return (this.__getterCache["forwardRef_nullableRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: RefOnChildrenChild,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          if (ref) {
            this.nullableRef__Ref__ = ref;
          } else {
            this.nullableRef__Ref__ = new UndefinedNativeElementRef();
          }
          this.nullableRef?.(this.nullableRef__Ref__);
        }
        return this.nullableRef?.();
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
    forwardRef_childRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
    forwardRef_nullableRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

  ngAfterViewInit() {
    this.childRef(this.childRef__Ref__);

    this.nullableRef?.(this.nullableRef__Ref__);
  }

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
  declarations: [RefOnChildrenChild],
  imports: [CommonModule],

  exports: [RefOnChildrenChild],
})
export class DxRefOnChildrenChildModule {}
export { RefOnChildrenChild as DxRefOnChildrenChildComponent };
