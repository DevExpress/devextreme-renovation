import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class WidgetInput {
  @Input() propArray: Array<string> = [];
  @Input() propObject: object = {};
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
  inputs: ["propArray", "propObject"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetInput {
  defaultEntries: DefaultEntries;

  internalArray: string[] = [];
  internalObject: object = {};
  keys: string[] = [];
  counter: number = 0;
  __effect(): any {
    const { propObject } = this;
    const { internalObject } = this;
    this._keys = Object.keys(propObject).concat(Object.keys(internalObject));
  }
  __effectWithObservables(): any {
    const { propArray } = this;
    const { internalArray } = this;
    this._counter = propArray.length + internalArray.length;
  }
  __onceEffect(): any {}
  __alwaysEffect(): any {}
  __myMethod(): any {}
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
  __schedule_effectWithObservables() {
    this.__destroyEffects[1]?.();
    this.__viewCheckedSubscribeEvent[1] = () => {
      this.__destroyEffects[1] = this.__effectWithObservables();
    };
  }
  __schedule_alwaysEffect() {
    this.__destroyEffects[3]?.();
    this.__viewCheckedSubscribeEvent[3] = () => {
      this.__destroyEffects[3] = this.__alwaysEffect();
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

  __cachedObservables: { [name: string]: Array<any> } = {};
  __checkObservables(keys: string[]) {
    let isChanged = false;
    keys.forEach((key) => {
      const cached = this.__cachedObservables[key];
      const current = (this as any)[key];
      if (
        cached.length !== current.length ||
        !cached.every((v, i) => current[i] === v)
      ) {
        isChanged = true;
        this.__cachedObservables[key] = [...current];
      }
    });

    return isChanged;
  }

  ngAfterViewInit() {
    this.__cachedObservables["propArray"] = this.propArray;
    this.__cachedObservables["internalArray"] = this.internalArray;
    this.__cachedObservables["keys"] = this.keys;
    this.__destroyEffects.push(
      this.__effect(),
      this.__effectWithObservables(),
      this.__onceEffect(),
      this.__alwaysEffect()
    );
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (
      this.__destroyEffects.length &&
      ["propObject"].some((d) => changes[d])
    ) {
      this.__schedule_effect();
    }

    if (this.__destroyEffects.length && ["propArray"].some((d) => changes[d])) {
      if (changes["propArray"]) {
        this.__cachedObservables["propArray"] = [
          ...changes["propArray"].currentValue,
        ];
      }
      this.__schedule_effectWithObservables();
    }

    if (this.__destroyEffects.length) {
      if (changes["propArray"]) {
        this.__cachedObservables["propArray"] = [
          ...changes["propArray"].currentValue,
        ];
      }
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
  ngDoCheck() {
    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["propArray", "internalArray"])
    ) {
      this._detectChanges();
      this.__schedule_effectWithObservables();
    }

    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["internalArray", "keys", "propArray"])
    ) {
      this._detectChanges();
      this.__schedule_alwaysEffect();
    }
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ["propArray", "propObject"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
  set _internalArray(internalArray: string[]) {
    this.internalArray = internalArray;
    this._detectChanges();
    this.__cachedObservables["internalArray"] = [...internalArray];

    if (this.__destroyEffects.length) {
      this.__schedule_effectWithObservables();
    }
    this._updateEffects();

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
    this._updateEffects();
  }
  set _internalObject(internalObject: object) {
    this.internalObject = internalObject;
    this._detectChanges();

    if (this.__destroyEffects.length) {
      this.__schedule_effect();
    }
    this._updateEffects();

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
    this._updateEffects();
  }
  set _keys(keys: string[]) {
    this.keys = keys;
    this._detectChanges();
    this.__cachedObservables["keys"] = [...keys];

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
    this._updateEffects();
  }
  set _counter(counter: number) {
    this.counter = counter;
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
