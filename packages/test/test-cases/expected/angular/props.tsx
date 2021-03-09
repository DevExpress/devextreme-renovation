type EventCallBack<Type> = (e: Type) => void;

import { Input, Output, EventEmitter } from "@angular/core";
export class WidgetInput {
  @Input() height: number = 10;
  @Input() export: object = {};
  @Input() sizes?: { height: number; width: number };
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  @Output() onSomething: EventEmitter<any> = new EventEmitter();
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
  inputs: ["height", "export", "sizes"],
  outputs: ["onClick", "onSomething"],
  template: `<span
    >{{(sizes ?? {width:0,height:0}).height


    }}{{(sizes ?? {width:0,height:0}).width}}</span
  >`,
})
export default class Widget extends WidgetInput {
  __getHeight(): number {
    this._onClick(10);
    this._onClick(11);
    return this.height;
  }
  __getRestProps(): { export: object; onSomething: EventCallBack<number> } {
    const { height, onClick, ...rest } = {
      height: this.height,
      export: this.export,
      sizes: this.sizes,
      onClick: this._onClick,
      onSomething: this._onSomething,
    };
    return rest;
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
  _onSomething: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
    this._onSomething = (e: any) => {
      this.onSomething.emit(e);
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
