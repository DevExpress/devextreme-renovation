import Child, { DxRefOnChildrenChildModule } from "./forward-ref-child";
import { Injectable, Input } from "@angular/core";
@Injectable()
class Props {
  @Input() nullableRef?: (
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
  selector: "dx-ref-on-children-parent",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["nullableRef"],
  template: `<ng-template #widgetTemplate
    ><dx-ref-on-children-child
      [childRef]="forwardRef_child"
      [nullableRef]="forwardRef_nullableRef"
      [state]="innerState"
      #child1
      style="display: contents"
    ></dx-ref-on-children-child
    ><ng-content *ngTemplateOutlet="child1?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class RefOnChildrenParent extends Props {
  child: ElementRef<HTMLDivElement> =
    new UndefinedNativeElementRef<HTMLDivElement>();
  innerState: number = 10;
  __effect(): any {
    if (this.child.nativeElement) {
      this.child.nativeElement.innerHTML = "Ref from child";
    }
    const html = this.nullableRef?.()?.nativeElement?.innerHTML;
  }
  get __restAttributes(): any {
    return {};
  }
  nullableRef__Ref__?: ElementRef<HTMLDivElement>;
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
        this: RefOnChildrenParent,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          this.child = ref!;
        }
        return this.child;
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
        this: RefOnChildrenParent,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          this.nullableRef__Ref__ = ref;
          this.nullableRef?.(ref);
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
      clearTimeout(this._effectTimeout);
      this._effectTimeout = setTimeout(() => {
        this.__viewCheckedSubscribeEvent.forEach((s, i) => {
          s?.();
          if (this.__viewCheckedSubscribeEvent[i] === s) {
            this.__viewCheckedSubscribeEvent[i] = null;
          }
        });
      });
    }
  }

  __getterCache: {
    forwardRef_child?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
    forwardRef_nullableRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__effect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (
      this.__destroyEffects.length &&
      ["child", "nullableRef"].some((d) => changes[d])
    ) {
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
  set _innerState(innerState: number) {
    this.innerState = innerState;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [RefOnChildrenParent],
  imports: [DxRefOnChildrenChildModule, CommonModule],
  entryComponents: [Child],
  exports: [RefOnChildrenParent],
})
export class DxRefOnChildrenParentModule {}
export { RefOnChildrenParent as DxRefOnChildrenParentComponent };
