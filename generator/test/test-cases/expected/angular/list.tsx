import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
const noop = (e: any) => {};

import { Input, TemplateRef } from "@angular/core";
export class ListInput {
  @Input() items?: Array<{ key: number; text: string }>;
  @Input() ListItem: TemplateRef<any> | null = null;
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
  selector: "dx-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["items", "ListItem"],
  template: `<div
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
        ><div>{{ item.text }}</div></ng-container
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_1"
        ><div
          ><ng-container
            *ngTemplateOutlet="
              ListItem || ListItemDefault;
              context: { value: item.text }
            "
          >
          </ng-container></div></ng-container
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_2"
        ><ng-container
          *ngTemplateOutlet="
            ListItem || ListItemDefault;
            context: { value: item.text, onClick: global_noop }
          "
        >
        </ng-container></ng-container></div
    ><ng-template #ListItemDefault let-value="value" let-onClick="onClick"
      ><dx-widget-with-props
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
        (onClick)="
          onClick !== undefined
            ? onClick($event)
            : WidgetWithPropsDefaults.onClick($event)
        "
      ></dx-widget-with-props>
    </ng-template>`,
})
export default class List extends ListInput {
  global_noop = noop;
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
    return item.key;
  }
  _trackBy_items_1(_index: number, item: any) {
    return item.key;
  }
  _trackBy_items_2(_index: number, item: any) {
    return item.key;
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [List],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [List],
})
export class DxListModule {}
export { List as DxListComponent };
