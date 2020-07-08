import { Input } from "@angular/core";

export class WidgetInput {
  @Input() myArray: Array<string> = [];
  @Input() myObject: object = {};
  @Input() mySimple: string = "";
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
  internalArray: string[] = [];
  internalObject: object = {};
  internalSimple: string = "";
  counter: number = 0;
  __effect(): any {}
  __effectWithObservables(): any {
    const { myArray } = this;
    const { counter, internalArray } = this;
    this._counter = myArray.length + internalArray.length + counter;
  }
  __onceEffect(): any {}
  __alwaysEffect(): any {}
  __myMethod(): any {}
  get __restAttributes(): any {
    return {};
  }

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<() => void> = [];
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
    this.__cachedObservables["myArray"] = this.myArray;
    this.__cachedObservables["internalArray"] = this.internalArray;
    this.__destroyEffects.push(
      this.__effect(),
      this.__effectWithObservables(),
      this.__onceEffect(),
      this.__alwaysEffect()
    );
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (this.__destroyEffects.length && ["myArray"].some((d) => changes[d])) {
      if (changes["myArray"]) {
        this.__cachedObservables["myArray"] = [
          ...changes["myArray"].currentValue,
        ];
      }
      this.__schedule_effectWithObservables();
    }

    if (this.__destroyEffects.length) {
      if (changes["myArray"]) {
        this.__cachedObservables["myArray"] = [
          ...changes["myArray"].currentValue,
        ];
      }
      this.__schedule_alwaysEffect();
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
  }
  ngAfterViewChecked() {
    this.__viewCheckedSubscribeEvent.forEach((s) => s?.());
    this.__viewCheckedSubscribeEvent = [];
  }
  ngDoCheck() {
    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["myArray", "internalArray"])
    ) {
      this.__schedule_effectWithObservables();
    }

    if (
      this.__destroyEffects.length &&
      this.__checkObservables(["internalArray", "myArray"])
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
      this.__schedule_alwaysEffect();
    }
  }
  set _internalSimple(internalSimple: string) {
    this.internalSimple = internalSimple;

    if (this.__destroyEffects.length) {
      this.__schedule_alwaysEffect();
    }
  }
  set _counter(counter: number) {
    this.counter = counter;

    if (this.__destroyEffects.length) {
      this.__schedule_effectWithObservables();
    }

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
