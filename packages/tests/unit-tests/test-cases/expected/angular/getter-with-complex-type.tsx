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
type UserType = "user" | "not";

import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class SomeNested {
  @Input() text: string = "";
}

@Component({
  template: "",
})
export class Props {
  @Input() p: number = 10;
  private __someNestedProp__?: SomeNested;
  @Input() set someNestedProp(value: SomeNested) {
    this.__someNestedProp__ = value;
  }
  get someNestedProp(): SomeNested {
    if (!this.__someNestedProp__) {
      return Props.__defaultNestedValues.someNestedProp;
    }
    return this.__someNestedProp__;
  }
  public static __defaultNestedValues: any = { someNestedProp: { text: "" } };
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
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Directive({
  selector: "dxo-some-nested-prop",
})
export class DxWidgetSomeNestedProp extends SomeNested {}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SimpleContext],
  inputs: ["p", "someNestedProp"],
  template: `<div></div>`,
})
export default class Widget extends Props {
  defaultEntries: DefaultEntries;

  mutableVar: number = 10;
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
    return this.p;
  }
  get __g3(): number {
    return this.i;
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
    return [this.i, this.mutableVar];
  }
  get __userGet(): UserType {
    return "user";
  }
  get __nestedGet(): { text: string } {
    return this.someNestedProp;
  }
  private __someNestedProp?: DxWidgetSomeNestedProp;
  @ContentChildren(DxWidgetSomeNestedProp)
  someNestedPropNested?: QueryList<DxWidgetSomeNestedProp>;
  get someNestedProp(): DxWidgetSomeNestedProp {
    if (this.__someNestedProp) {
      return this.__someNestedProp;
    }
    const nested = this.someNestedPropNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return Props.__defaultNestedValues.someNestedProp;
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
    g4?: number[];
  } = {};
  resetDependantGetters(): void {
    this.__getterCache["g4"] = undefined;
  }
  _destroyContext: Array<() => void> = [];

  ngAfterViewInit() {
    this._detectChanges();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (["p"].some((d) => changes[d])) {
      this.__getterCache["g1"] = undefined;
    }
  }
  ngOnDestroy() {
    this._destroyContext.forEach((d) => d());
  }

  ngDoCheck() {
    this.__provide;
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    @Host() private provideProvider: SimpleContext,
    @SkipSelf() @Optional() private cons: SimpleContext
  ) {
    super();
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ["p"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
  }
  @Input() set someNestedProp(value: DxWidgetSomeNestedProp) {
    this.__someNestedProp = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget, DxWidgetSomeNestedProp],
  imports: [CommonModule],

  exports: [Widget, DxWidgetSomeNestedProp],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };

class SomeClass {
  i: number = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
