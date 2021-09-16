import { Input } from "@angular/core";
class WidgetProps {
  @Input() someProp: string = "";
  @Input() type?: string = "";
}
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someProp", "type"],
  template: `<div></div>`,
})
class Widget extends WidgetProps {
  get __g7(): any {
    return this.__g6;
  }
  get __g5(): (string | undefined)[] {
    if (this.__getterCache["g5"] !== undefined) {
      return this.__getterCache["g5"];
    }
    return (this.__getterCache["g5"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.__g2];
    })());
  }
  get __g1(): any {
    return this.someProp;
  }
  get __g2(): any {
    return this.type;
  }
  g3(): (string | undefined)[] {
    return [this.__g1, this.__g2];
  }
  get __g4(): (string | undefined)[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.__g1];
    })());
  }
  get __g6(): (string | undefined)[] {
    if (this.__getterCache["g6"] !== undefined) {
      return this.__getterCache["g6"];
    }
    return (this.__getterCache["g6"] = ((): (string | undefined)[] => {
      return [...this.__g5, ...this.__g4];
    })());
  }
  __someEffect(): any {
    return () => this.__g7;
  }
  get __restAttributes(): any {
    return {};
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
  __schedule_someEffect() {
    this.__destroyEffects[0]?.();
    this.__viewCheckedSubscribeEvent[0] = () => {
      this.__destroyEffects[0] = this.__someEffect();
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
    g5?: (string | undefined)[];
    g4?: (string | undefined)[];
    g6?: (string | undefined)[];
  } = {};

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__someEffect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (
      this.__destroyEffects.length &&
      ["someProp", "type"].some((d) => changes[d])
    ) {
      this.__schedule_someEffect();
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g5"] = undefined;
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g4"] = undefined;
    }

    if (["someProp", "type"].some((d) => changes[d])) {
      this.__getterCache["g6"] = undefined;
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
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
