import { Input, TemplateRef } from "@angular/core";
class Props {
  @Input() contentTemplate: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-ref-on-children-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container
    *ngTemplateOutlet="contentTemplate; context: { childRef: forwardRef_child }"
  ></ng-container>`,
})
export default class RefOnChildrenTemplate extends Props {
  child!: ElementRef<HTMLDivElement>;
  __effect(): any {
    this.child.nativeElement.innerHTML += "ParentText";
  }
  get __restAttributes(): any {
    return {};
  }
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
  } = {};

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__effect());
    }, 0);
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

  constructor(private changeDetection: ChangeDetectorRef) {
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
