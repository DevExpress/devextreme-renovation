const modifyStyles = (styles: any) => {
  return { height: "100px", ...styles };
};
import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() height: number = 10;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  @Input() p?: string = "";
  @Output() pChange: EventEmitter<string> = new EventEmitter();
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
  inputs: ["height", "p"],
  outputs: ["onClick", "pChange"],
  template: `<span [ngStyle]="__processNgStyle(__styles)"></span>`,
})
export default class Widget extends WidgetInput {
  get __styles(): any {
    const { style } = this.__restAttributes;
    return modifyStyles(style);
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

  _onClick: any;
  _pChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
    this._pChange = (e: any) => {
      this.pChange.emit(e);
      this._detectChanges();
    };
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
