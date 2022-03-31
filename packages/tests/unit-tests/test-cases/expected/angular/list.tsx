import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from './dx-widget-with-props';
const noop = (e: any) => {};

import { Component, Input, TemplateRef } from '@angular/core';
@Component({
  template: '',
})
export class ListInput {
  @Input() items?: Array<{ key: number; text: string }>;
  @Input() ListItem: TemplateRef<any> | null = null;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['items', 'ListItem'],
  template: `<ng-template #widgetTemplate
    ><div
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
          </ng-container
          ><div class="footer"></div></div></ng-container
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_2"
        ><ng-container
          *ngTemplateOutlet="
            ListItem || ListItemDefault;
            context: { value: item.text, onClick: global_noop }
          "
        >
        </ng-container></ng-container
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_3"
        ><ng-container *ngIf="item.text !== ''">
          <ng-container
            *ngTemplateOutlet="
              ListItem || ListItemDefault;
              context: { value: item.text, onClick: global_noop }
            "
          >
          </ng-container> </ng-container></ng-container></div
    ><ng-template #ListItemDefault let-value="value" let-onClick="onClick">
      <dx-widget-with-props
        #compRef
        style="display: contents"
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
        (onClick)="onClick($event)"
      ></dx-widget-with-props>
      <ng-content
        *ngTemplateOutlet="compRef?.widgetTemplate"
      ></ng-content> </ng-template
  ></ng-template>`,
})
export default class List extends ListInput {
  global_noop = noop;

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
  _trackBy_items_3(_index: number, item: any) {
    return item.key;
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  WidgetWithPropsDefaults = { value: 'default text', number: 42 };
}
@NgModule({
  declarations: [List],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [List],
})
export class DxListModule {}
export { List as DxListComponent };
