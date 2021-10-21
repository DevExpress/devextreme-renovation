import {
  InterfaceTemplateInput as externalInterface,
  Options as externalType,
} from "./types.d";

import { Input } from "@angular/core";
class WidgetProps {
  @Input() someProp: string = "";
  @Input() type?: string = "";
}

interface internalInterface {
  field1: { a: string };
  field2: number;
  field3: number;
}
type internalType = { a: string };
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

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someProp", "type"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
class Widget extends WidgetProps {
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
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["someProp"].some((d) => changes[d])) {
      this.__getterCache["internalInterfaceGetter"] = undefined;
    }
  }

  @ViewChild("widgetTemplate", { static: false })
  widgetTemplate: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
