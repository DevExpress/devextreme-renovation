import { Input } from "@angular/core";
export class WidgetInput {
  @Input() propArray: Array<string> = [];
  @Input() propObject: object = {};
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
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
  get __restAttributes(): any {
    return {};
  }

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<() => void> = [];
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
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(
        this.__effect(),
        this.__effectWithObservables(),
        this.__onceEffect(),
        this.__alwaysEffect()
      );
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
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
    if (this.__viewCheckedSubscribeEvent.length) {
      this._effectTimeout = setTimeout(() => {
        this.__viewCheckedSubscribeEvent.forEach((s) => s?.());
        this.__viewCheckedSubscribeEvent = [];
      });
    }
  }
  ngDoCheck() {
    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["propArray", "internalArray"])
    ) {
      this.__schedule_effectWithObservables();
    }

    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["internalArray", "keys", "propArray"])
    ) {
      this.__schedule_alwaysEffect();
    }
  }

  set _internalArray(internalArray: string[]) {
    this.internalArray = internalArray;
    this.__cachedObservables["internalArray"] = [...internalArray];

    if (this.__destroyEffects.length) {
      this.__schedule_effectWithObservables();
    }

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
  set _internalObject(internalObject: object) {
    this.internalObject = internalObject;

    if (this.__destroyEffects.length) {
      this.__schedule_effect();
    }

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
  set _keys(keys: string[]) {
    this.keys = keys;
    this.__cachedObservables["keys"] = [...keys];

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
  set _counter(counter: number) {
    this.counter = counter;

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
