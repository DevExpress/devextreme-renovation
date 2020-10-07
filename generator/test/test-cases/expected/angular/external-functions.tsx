import { namedFunction as externalFunction } from "./functions";
declare type Cell = { text: string; visible: boolean };
const arrowFunction: () => string = () => {
  return "defaultClassName";
};
const conditionFn: (cell: Cell) => boolean = (cell) => {
  return cell.visible;
};
const getValue: (cell: Cell) => string = (cell) => cell.text;
const CLASS_NAME = arrowFunction();
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() cells: Cell[] = [];
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
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    [class]="global_CLASS_NAME"
    [ngStyle]="__processNgStyle(global_externalFunction())"
    ><ng-container
      *ngFor="let cell of cells; index as index; trackBy: _trackBy_cells_0"
      ><span
        ><div *ngIf="global_conditionFn(cell) && index > 0"
          >{{ global_getValue(cell) }}{{ __addPostfix(index) }}</div
        ></span
      ></ng-container
    ></div
  >`,
})
export default class Widget extends WidgetProps {
  global_CLASS_NAME = CLASS_NAME;
  global_externalFunction = externalFunction;
  global_conditionFn = conditionFn;
  global_getValue = getValue;
  __addPostfix(index: number): any {
    return `_#${index}`;
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

  _trackBy_cells_0(index: number, cell: any) {
    return index;
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }

  __processNgStyle(value: any) {
    if (typeof value === "object") {
      return Object.keys(value).reduce((v: { [name: string]: any }, k) => {
        if (typeof value[k] === "number") {
          v[k] = value[k] + "px";
        } else {
          v[k] = value[k];
        }
        return v;
      }, {});
    }

    return value;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
