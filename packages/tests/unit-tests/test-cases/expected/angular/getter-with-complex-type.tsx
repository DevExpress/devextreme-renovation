import {
  Injectable,
  EventEmitter as ContextEmitter,
  SkipSelf,
  Optional,
  Host,
} from "@angular/core";

interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}
@Injectable()
class SimpleContext {
  _value: number = 5;
  change: ContextEmitter<number> = new ContextEmitter();
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }
}
import { Input } from "@angular/core";
export class Props {
  @Input() p: number = 10;
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
  providers: [SimpleContext],
  inputs: ["p"],
  template: `<div></div>`,
})
export default class Widget extends Props {
  mutableField: number = 3;
  i: number = 10;
  get __provide(): any {
    if (this.__getterCache["provide"] !== undefined) {
      return this.__getterCache["provide"];
    }
    return (this.provideProvider.value = this.__getterCache["provide"] =
      ((): any => {
        return this.i;
      })());
  }
  consConsumer: number;
  get __g1(): number[] {
    if (this.__getterCache["g1"] !== undefined) {
      return this.__getterCache["g1"];
    }
    return (this.__getterCache["g1"] = ((): number[] => {
      return [this.p, this.i];
    })());
  }
  get __g2(): number {
    if (this.__getterCache["g2"] !== undefined) {
      return this.__getterCache["g2"];
    }
    return (this.__getterCache["g2"] = ((): number => {
      return this.p;
    })());
  }
  get __g3(): number {
    if (this.__getterCache["g3"] !== undefined) {
      return this.__getterCache["g3"];
    }
    return (this.__getterCache["g3"] = ((): number => {
      return this.i;
    })());
  }
  get __g4(): number[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): number[] => {
      return [this.consConsumer];
    })());
  }
  get __g5(): number[] {
    return [this.p, this.mutableField];
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

  __getterCache: {
    provide?: any;
    g1?: number[];
    g2?: number;
    g3?: number;
    g4?: number[];
  } = {};
  resetDependantGetters(): void {
    this.__getterCache["g4"] = undefined;
  }
  _destroyContext: Array<() => void> = [];

  ngOnChanges(changes: { [name: string]: any }) {
    if (["p"].some((d) => changes[d])) {
      this.__getterCache["g1"] = undefined;
    }

    if (["p"].some((d) => changes[d])) {
      this.__getterCache["g2"] = undefined;
    }
  }
  ngOnDestroy() {
    this._destroyContext.forEach((d) => d());
  }

  ngDoCheck() {
    this.__provide;
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    @Host() private provideProvider: SimpleContext,
    @SkipSelf() @Optional() private cons: SimpleContext
  ) {
    super();
    if (!cons) {
      this.cons = new SimpleContext();
    } else {
      const changeHandler = (value: number) => {
        this.consConsumer = value;
        this.resetDependantGetters();
        this._detectChanges();
      };
      const subscription = cons.change.subscribe(changeHandler);
      this._destroyContext.push(() => {
        subscription.unsubscribe();
      });
    }
    this.consConsumer = this.cons.value;
  }
  set _i(i: number) {
    this.i = i;
    this._detectChanges();
    this.__getterCache["provide"] = undefined;
    this.__getterCache["g1"] = undefined;
    this.__getterCache["g3"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };

class SomeClass {
  i: number = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
