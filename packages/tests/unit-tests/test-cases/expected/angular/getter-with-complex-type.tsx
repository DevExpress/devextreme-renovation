import {
  Injectable,
  EventEmitter as ContextEmitter,
  SkipSelf,
  Optional,
  Host,
} from "@angular/core";
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
  i: number = 10;
  get __provide(): any {
    if (this.__getterCache["provide"] !== undefined) {
      return this.__getterCache["provide"];
    }
    return (this.provideProvider.value = this.__getterCache["provide"] =
      (() => {
        return this.i;
      })());
  }
  get __g1(): number[] {
    if (this.__getterCache["g1"] !== undefined) {
      return this.__getterCache["g1"];
    }
    return (this.__getterCache["g1"] = ((): number[] => {
      return [this.p, this.i];
    })());
  }
  get __g2(): number {
    return this.p;
  }
  get __g3(): number {
    return this.i;
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
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["p"].some((d) => changes[d])) {
      this.__getterCache["g1"] = undefined;
    }
  }

  ngDoCheck() {
    this.__provide;
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    @Host() private provideProvider: SimpleContext
  ) {
    super();
  }
  set _i(i: number) {
    this.i = i;
    this._detectChanges();
    this.__getterCache["provide"] = undefined;
    this.__getterCache["g1"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
