import { namedFunction as externalFunction } from "./functions";
const arrowFunction: () => string = () => {
  return "defaultClassName";
};
const CLASS_NAME = arrowFunction();
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() index: number = 0;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="CLASS_NAME" [ngStyle]="externalFunction()"></div>`,
})
export default class Widget extends WidgetProps {
  get __restAttributes(): any {
    return {};
  }
  externalFunction: any = externalFunction;
  arrowFunction: any = arrowFunction;
  CLASS_NAME: any = CLASS_NAME;

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
