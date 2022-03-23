import { namedFunction as externalFunction } from './functions';
import { SomeClass } from './class';
declare type Cell = { text: string; visible: boolean };
const arrowFunction: () => string = () => {
  return 'defaultClassName';
};
const conditionFn: (cell: Cell) => boolean = (cell) => {
  return cell.visible;
};
const getValue: (cell: Cell) => string = (cell) => cell.text;
const array = new Array(100).map((_, index) => index);
const CLASS_NAME = arrowFunction();
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class WidgetProps {
  @Input() cells: Cell[] = [];
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
  normalizeStyles,
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['cells'],
  template: `<ng-template #widgetTemplate
    ><div
      [class]="global_CLASS_NAME"
      [ngStyle]="__processNgStyle(global_externalFunction())"
      ><ng-container
        *ngFor="let cell of cells; index as index; trackBy: _trackBy_cells_0"
        ><span
          ><div *ngIf="global_conditionFn(cell) && index > 0"
            >{{ global_getValue(cell) }}{{ __addPostfix(index)
            }}{{ global_SomeClass.name }}</div
          ></span
        ></ng-container
      ><div
        ><ng-container
          *ngFor="let i of global_array; trackBy: _trackBy_global_array_1"
          ><div>{{ i.toString() }}</div></ng-container
        ></div
      ></div
    ></ng-template
  >`,
})
export default class Widget extends WidgetProps {
  global_CLASS_NAME = CLASS_NAME;
  global_externalFunction = externalFunction;
  global_conditionFn = conditionFn;
  global_getValue = getValue;
  global_SomeClass = SomeClass;
  global_array = array;
  defaultEntries: DefaultEntries;

  __addPostfix(index: number): any {
    return `_#${index}`;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  _trackBy_cells_0(index: number, cell: any) {
    return index;
  }
  _trackBy_global_array_1(_index: number, i: any) {
    return i;
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
    this.defaultEntries = ['cells'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }

  __processNgStyle(value: any) {
    return normalizeStyles(value);
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
