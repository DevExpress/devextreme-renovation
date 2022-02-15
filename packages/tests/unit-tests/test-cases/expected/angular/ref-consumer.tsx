import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class Props {
  @Input() elementRef?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
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
  selector: "dx-ref-consumer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["elementRef"],
  template: `<span>consumer is rendered</span>`,
})
export default class RefConsumer extends Props {
  __getElementRef(): any {
    const temp = this.elementRef?.()?.nativeElement;
    return temp;
  }
  __init(): any {
    const elementRef = this.__getElementRef();
    if (elementRef) {
      elementRef.innerHTML += ":element passed";
    }
  }
  elementRef__Ref__?: ElementRef<HTMLDivElement>;
  get forwardRef_elementRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_elementRef"] !== undefined) {
      return this.__getterCache["forwardRef_elementRef"];
    }
    return (this.__getterCache["forwardRef_elementRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: RefConsumer,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          if (ref) {
            this.elementRef__Ref__ = ref;
          } else {
            this.elementRef__Ref__ = new UndefinedNativeElementRef();
          }
          this.elementRef?.(this.elementRef__Ref__);
        }
        return this.elementRef?.();
      }.bind(this);
    })());
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<(() => void) | null> = [];
  _effectTimeout: any;
  __getterCache: {
    forwardRef_elementRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

  ngAfterViewInit() {
    this.__destroyEffects.push(this.__init());
  }

  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
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
  declarations: [RefConsumer],
  imports: [CommonModule],

  exports: [RefConsumer],
})
export class DxRefConsumerModule {}
export { RefConsumer as DxRefConsumerComponent };
