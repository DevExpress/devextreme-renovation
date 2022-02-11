function subscribe(p: string, s: number, i: number) {
  return 1;
}
function unsubscribe(id: number) {
  return undefined;
}

import { Component, Input, Output, EventEmitter } from "@angular/core";
@Component({
  template: "",
})
export class WidgetInput {
  @Input() p: string = "10";
  @Input() r: string = "20";
  @Input() s: number = 10;
  @Output() sChange: EventEmitter<number> = new EventEmitter();
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
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["p", "r", "s"],
  outputs: ["sChange"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetInput {
  defaultEntries: DefaultEntries;
  i: number = 10;
  j: number = 20;
  __setupData(): any {
    const id = subscribe(this.__getP(), this.s, this.i);
    this._i = 15;
    return () => unsubscribe(id);
  }
  __onceEffect(): any {
    const id = subscribe(this.__getP(), this.s, this.i);
    this._i = 15;
    return () => unsubscribe(id);
  }
  __alwaysEffect(): any {
    const id = subscribe(this.__getP(), 1, 2);
    return () => unsubscribe(id);
  }
  __getP(): any {
    return this.p;
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
  __schedule_setupData() {
    this.__destroyEffects[0]?.();
    this.__viewCheckedSubscribeEvent[0] = () => {
      this.__destroyEffects[0] = this.__setupData();
    };
  }
  __schedule_alwaysEffect() {
    this.__destroyEffects[2]?.();
    this.__viewCheckedSubscribeEvent[2] = () => {
      this.__destroyEffects[2] = this.__alwaysEffect();
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

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(
        this.__setupData(),
        this.__onceEffect(),
        this.__alwaysEffect()
      );
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (this.__destroyEffects.length && ["p", "s"].some((d) => changes[d])) {
      this.__schedule_setupData();
    }

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }
  ngAfterViewChecked() {
    this._updateEffects();
  }

  _sChange: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ["p", "r", "s"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
    this._sChange = (e: any) => {
      this.sChange.emit(e);

      this._detectChanges();
    };
  }
  set _i(i: number) {
    this.i = i;
    this._detectChanges();

    if (this.__destroyEffects.length) {
      this.__schedule_setupData();
    }
    this._updateEffects();

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
    this._updateEffects();
  }
  set _j(j: number) {
    this.j = j;
    this._detectChanges();

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
    this._updateEffects();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
