import { COMPONENT_INPUT_CLASS } from "./component-input";
import {
  WidgetTwo as ExternalComponent,
  DxWidgetTwoModule,
} from "./component-pass-two";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
type Item = { text: string; key: number };
const getKey = (item: Item) => item.key;
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() items: Item[] = [];
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
  selector: "dx-widget-with-globals",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["items"],
  template: `<div [class]="global_CLASS_NAME"
    ><span [class]="global_CLASS_NAME"></span><dx-widget-two></dx-widget-two
    ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
      ><div></div></ng-container
  ></div>`,
})
export default class WidgetWithGlobals extends WidgetProps {
  global_CLASS_NAME = CLASS_NAME;
  global_getKey = getKey;
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  _trackBy_items_0(_index: number, item: any) {
    return this.global_getKey(item);
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithGlobals],
  imports: [DxWidgetTwoModule, CommonModule],
  entryComponents: [ExternalComponent],
  exports: [WidgetWithGlobals],
})
export class DxWidgetWithGlobalsModule {}
export { WidgetWithGlobals as DxWidgetWithGlobalsComponent };
