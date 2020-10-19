import Child, { DxRefOnChildrenChildModule } from "./forward-ref-child";
import { Input } from "@angular/core";
class Props {
  @Input() nullableRef?: (ref: any) => void;
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
  selector: "dx-ref-on-children-parent",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dx-ref-on-children-child
    [childRef]="forwardRef_child"
    [nullableRef]="forwardRef_nullableRef"
    [state]="innerState"
  ></dx-ref-on-children-child>`,
})
export default class RefOnChildrenParent extends Props {
  child!: ElementRef<HTMLDivElement>;
  innerState: number = 10;
  __effect(): any {
    this.child.nativeElement.innerHTML = "Ref from child";
    const html = this.nullableRefRef?.nativeElement?.innerHTML;
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("nullableRefRef", { static: false }) nullableRefRef?: ElementRef<
    HTMLDivElement
  >;
  get forwardRef_child(): (ref: any) => void {
    if (this.__getterCache["forwardRef_child"] !== undefined) {
      return this.__getterCache["forwardRef_child"];
    }
    return (this.__getterCache["forwardRef_child"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.child = ref;

        return ref;
      };
    })());
  }
  get forwardRef_nullableRef(): (ref: any) => void {
    if (this.__getterCache["forwardRef_nullableRef"] !== undefined) {
      return this.__getterCache["forwardRef_nullableRef"];
    }
    return (this.__getterCache["forwardRef_nullableRef"] = ((): ((
      ref: any
    ) => void) => {
      return (ref) => {
        this.nullableRefRef = ref;
        this.nullableRef?.(ref);
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
    forwardRef_child?: (ref: any) => void;
    forwardRef_nullableRef?: (ref: any) => void;
  } = {};

  ngAfterViewInit() {
    this.nullableRef?.(this.nullableRefRef);

    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__effect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (
      this.__destroyEffects.length &&
      ["nullableRef"].some((d) => changes[d])
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

  constructor(private changeDetection: ChangeDetectorRef) {
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
  exports: [RefOnChildrenParent],
})
export class DxRefOnChildrenParentModule {}
export { RefOnChildrenParent as DxRefOnChildrenParentComponent };
