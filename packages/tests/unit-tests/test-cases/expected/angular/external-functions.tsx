import { namedFunction as externalFunction } from "./functions";
import { SomeClass } from "./class";
declare type Cell = { text: string; visible: boolean };
const arrowFunction: () => string = () => {
  return "defaultClassName";
};
const conditionFn: (cell: Cell) => boolean = (cell) => {
  return cell.visible;
};
const getValue: (cell: Cell) => string = (cell) => cell.text;
const array = new Array(100).map((_, index) => index);
const CLASS_NAME = arrowFunction();
import { Injectable, Input } from "@angular/core";
@Injectable()
export class WidgetProps {
  @Input() cells: Cell[] = [];
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

const NUMBER_STYLES = new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
]);

const uppercasePattern = /[A-Z]/g;
const kebabCase = (str: string) => {
  return str.replace(uppercasePattern, "-$&").toLowerCase();
};

const isNumeric = (value: string | number) => {
  if (typeof value === "number") return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style: string, value: string | number) => {
  return NUMBER_STYLES.has(style) ? value : `${value}px`;
};

const normalizeStyles = (styles: unknown) => {
  if (!(styles instanceof Object)) return undefined;

  return Object.entries(styles).reduce(
    (result: Record<string, string | number>, [key, value]) => {
      const kebabString = kebabCase(key);
      result[kebabString] = isNumeric(value)
        ? getNumberStyleValue(kebabString, value)
        : value;
      return result;
    },
    {} as Record<string, string | number>
  );
};

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["cells"],
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ["cells"].map((key) => ({
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
