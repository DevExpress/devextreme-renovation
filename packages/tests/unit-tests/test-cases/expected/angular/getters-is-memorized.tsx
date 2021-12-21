import {
  InterfaceTemplateInput as externalInterface,
  Options as externalType,
} from "./types.d";

import { Component, Input, Output, EventEmitter } from "@angular/core";
@Component({
  template: "",
})
class WidgetProps {
  @Input() someProp: string = "";
  @Input() type?: string = "";
  @Input() currentDate: Date | number | string = new Date();
  @Output() currentDateChange: EventEmitter<Date | number | string> =
    new EventEmitter();
}

interface internalInterface {
  field1: { a: string };
  field2: number;
  field3: number;
}
type internalType = { a: string };
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
  inputs: ["someProp", "type", "currentDate"],
  outputs: ["currentDateChange"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;
  get __internalInterfaceGetter(): internalInterface {
    if (this.__getterCache["internalInterfaceGetter"] !== undefined) {
      return this.__getterCache["internalInterfaceGetter"];
    }
    return (this.__getterCache["internalInterfaceGetter"] =
      ((): internalInterface => {
        return { field1: { a: this.someProp }, field2: 2, field3: 3 };
      })());
  }
  get __internalTypeGetter(): internalType {
    if (this.__getterCache["internalTypeGetter"] !== undefined) {
      return this.__getterCache["internalTypeGetter"];
    }
    return (this.__getterCache["internalTypeGetter"] = ((): internalType => {
      return { a: "1" };
    })());
  }
  get __externalInterfaceGetter(): externalInterface {
    if (this.__getterCache["externalInterfaceGetter"] !== undefined) {
      return this.__getterCache["externalInterfaceGetter"];
    }
    return (this.__getterCache["externalInterfaceGetter"] =
      ((): externalInterface => {
        return { inputInt: 2 };
      })());
  }
  get __externalTypeGetter(): externalType {
    if (this.__getterCache["externalTypeGetter"] !== undefined) {
      return this.__getterCache["externalTypeGetter"];
    }
    return (this.__getterCache["externalTypeGetter"] = ((): externalType => {
      return { value: "" };
    })());
  }
  get __someDate(): Date {
    if (this.__getterCache["someDate"] !== undefined) {
      return this.__getterCache["someDate"];
    }
    return (this.__getterCache["someDate"] = ((): Date => {
      return new Date(this.currentDate);
    })());
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
    internalInterfaceGetter?: internalInterface;
    internalTypeGetter?: internalType;
    externalInterfaceGetter?: externalInterface;
    externalTypeGetter?: externalType;
    someDate?: Date;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (["someProp"].some((d) => changes[d])) {
      this.__getterCache["internalInterfaceGetter"] = undefined;
    }

    if (["currentDate"].some((d) => changes[d])) {
      this.__getterCache["someDate"] = undefined;
    }
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
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ["someProp", "type", "currentDate"].map((key) => ({
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
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
