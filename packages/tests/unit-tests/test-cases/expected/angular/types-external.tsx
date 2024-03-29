export type EnumType = 'data' | 'none';
export type Union = string | number;
export type ObjType = { number: number; text: string };
export type StringArr = Array<String>;
export type StringType = String;
export type StrDate = string | Date;
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class WidgetProps {
  @Input() data: EnumType = 'data';
  @Input() union: Union = 'uniontext';
  @Input() obj: ObjType = { number: 123, text: 'sda' };
  @Input() strArr: StringArr = ['ba', 'ab'];
  @Input() s: StringType = '';
  @Input() strDate: StrDate = new Date();
  @Input() customTypeField?: { name: string; customField: CustomType }[];
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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['data', 'union', 'obj', 'strArr', 's', 'strDate', 'customTypeField'],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;

  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = [
      'data',
      'union',
      'obj',
      'strArr',
      's',
      'strDate',
    ].map((key) => ({ key, value: defaultProps[key] }));
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };

export interface CustomType {
  name: string;
  value: number;
}
