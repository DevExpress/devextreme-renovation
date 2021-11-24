import { COMPONENT_INPUT_CLASS } from "./component-input";
import {
  WidgetTwo as ExternalComponent,
  DxWidgetTwoModule,
} from "./component-pass-two";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
export type Item = { text: string; key: number };
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
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-globals",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["items"],
  template: `<ng-template #widgetTemplate
    ><div [class]="global_CLASS_NAME"
      ><span [class]="global_CLASS_NAME"></span
      ><dx-widget-two
        #externalcomponent1
        styles="{display: contents}"
      ></dx-widget-two
      ><ng-content
        *ngTemplateOutlet="externalcomponent1?.widgetTemplate"
      ></ng-content
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
        ><div></div></ng-container></div
  ></ng-template>`,
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
