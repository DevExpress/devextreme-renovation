type EventCallBack<Type> = (e: Type) => void;
const device = 'ios';
function isDevice() {
  return true;
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  template: '',
})
export class WidgetInput {
  @Input() height: number = 10;
  @Input() export: object = {};
  @Input() array: any = ['1'];
  @Input() currentDate: any = new Date();
  @Input() expressionDefault: string = device === 'ios' ? 'yes' : 'no';
  @Input() expressionDefault1: boolean = !device;
  @Input() expressionDefault2: boolean | string = isDevice() || 'test';
  @Input() sizes?: { height: number; width: number };
  @Input() stringValue: string = '';
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  @Output() onSomething: EventEmitter<any> = new EventEmitter();
  @Output() stringValueChange: EventEmitter<string> = new EventEmitter();
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
  inputs: [
    'height',
    'export',
    'array',
    'currentDate',
    'expressionDefault',
    'expressionDefault1',
    'expressionDefault2',
    'sizes',
    'stringValue',
  ],
  outputs: ['onClick', 'onSomething', 'stringValueChange'],
  template: `<ng-template #widgetTemplate
    ><span
      >{{ (sizes ?? { width: 0, height: 0 }).height
      }}{{ (sizes ?? { width: 0, height: 0 }).width }}</span
    ></ng-template
  >`,
})
export default class Widget extends WidgetInput {
  defaultEntries: DefaultEntries;

  __getHeight(): number {
    this._onClick(10);
    this._onClick(11);
    return this.height;
  }
  __getRestProps(): { export: object; onSomething: EventCallBack<number> } {
    const { height, onClick, ...rest } = {
      height: this.height,
      export: this.export,
      array: this.array,
      currentDate: this.currentDate,
      expressionDefault: this.expressionDefault,
      expressionDefault1: this.expressionDefault1,
      expressionDefault2: this.expressionDefault2,
      sizes: this.sizes,
      stringValue: this.stringValue,
      onClick: this._onClick,
      onSomething: this._onSomething,
      stringValueChange: this._stringValueChange,
    };
    return rest;
  }
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

  _onClick: any;
  _onSomething: any;
  _stringValueChange: any;
  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = [
      'height',
      'export',
      'array',
      'currentDate',
      'expressionDefault',
      'expressionDefault1',
      'expressionDefault2',
      'stringValue',
    ].map((key) => ({ key, value: defaultProps[key] }));
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
    this._onSomething = (e: any) => {
      this.onSomething.emit(e);
    };
    this._stringValueChange = (e: any) => {
      this.stringValueChange.emit(e);

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
