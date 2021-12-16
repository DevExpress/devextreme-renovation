import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
export class FirstProps {
  @Input() currentDate: any = new Date();
  @Output() currentDateChange: EventEmitter<any> = new EventEmitter();
}

import {
  Component,
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
  selector: "dx-first",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["currentDate"],
  outputs: ["currentDateChange"],
  template: `<div>{{ __currentDateGetter.toLocaleString() }}</div>`,
})
export default class First extends FirstProps {
  defaultEntries: DefaultEntries;
  get __currentDateGetter(): Date {
    if (this.__getterCache["currentDateGetter"] !== undefined) {
      return this.__getterCache["currentDateGetter"];
    }
    return (this.__getterCache["currentDateGetter"] = ((): Date => {
      return this.currentDate;
    })());
  }
  __clickEffect(): void {
    this._currentDateChange((this.currentDate = new Date(2023, 1, 12)));
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
    currentDateGetter?: Date;
  } = {};

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__clickEffect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (["currentDate"].some((d) => changes[d])) {
      this.__getterCache["currentDateGetter"] = undefined;
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }
  ngAfterViewChecked() {
    this._updateEffects();
  }

  _currentDateChange: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new FirstProps() as { [key: string]: any };
    this.defaultEntries = ["currentDate"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
    this._currentDateChange = (e: any) => {
      this.currentDateChange.emit(e);
      this._detectChanges();
    };
  }
}
@NgModule({
  declarations: [First],
  imports: [CommonModule],

  exports: [First],
})
export class DxFirstModule {}
export { First as DxFirstComponent };
