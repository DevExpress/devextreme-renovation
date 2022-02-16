import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
class Props {
  @Input() contentTemplate: TemplateRef<any> | null = null;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { UndefinedNativeElementRef } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-ref-on-children-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["contentTemplate"],
  template: `<ng-template #widgetTemplate
    ><ng-container
      *ngTemplateOutlet="
        contentTemplate;
        context: { childRef: forwardRef_child }
      "
    ></ng-container
  ></ng-template>`,
})
export default class RefOnChildrenTemplate extends Props {
  child: ElementRef<HTMLDivElement> =
    new UndefinedNativeElementRef<HTMLDivElement>();
  __effect(): any {
    if (this.child.nativeElement) {
      this.child.nativeElement.innerHTML += "ParentText";
    }
  }
  get forwardRef_child(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_child"] !== undefined) {
      return this.__getterCache["forwardRef_child"];
    }
    return (this.__getterCache["forwardRef_child"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: RefOnChildrenTemplate,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          if (ref) {
            this.child = ref;
          } else {
            this.child = new UndefinedNativeElementRef();
          }
        }
        return this.child;
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
  __schedule_effect() {
    this.__destroyEffects[0]?.();
    this.__viewCheckedSubscribeEvent[0] = () => {
      this.__destroyEffects[0] = this.__effect();
    };
  }

  _updateEffects() {
    if (this.__viewCheckedSubscribeEvent.length) {
      this.__viewCheckedSubscribeEvent.forEach((s, i) => {
        s?.();
        if (this.__viewCheckedSubscribeEvent[i] === s) {
          this.__viewCheckedSubscribeEvent[i] = null;
        }
      });
    }
  }

  __getterCache: {
    forwardRef_child?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
  } = {};

  ngAfterViewInit() {
    this.__destroyEffects.push(this.__effect());
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (this.__destroyEffects.length && ["child"].some((d) => changes[d])) {
      this.__schedule_effect();
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }
  ngAfterViewChecked() {
    this._updateEffects();
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
  declarations: [RefOnChildrenTemplate],
  imports: [CommonModule],

  exports: [RefOnChildrenTemplate],
})
export class DxRefOnChildrenTemplateModule {}
export { RefOnChildrenTemplate as DxRefOnChildrenTemplateComponent };
