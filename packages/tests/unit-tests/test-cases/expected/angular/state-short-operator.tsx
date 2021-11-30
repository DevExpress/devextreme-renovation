import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
class WidgetInput {
  __propStateInternalValue?: number = 1;
  @Input()
  set propState(value: number | undefined) {
    if (value !== undefined) this.__propStateInternalValue = value;
    else this.__propStateInternalValue = 1;
  }
  get propState() {
    return this.__propStateInternalValue;
  }
  @Output() propStateChange: EventEmitter<number> = new EventEmitter();
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

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["propState"],
  outputs: ["propStateChange"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetInput {
  innerState: number = 0;
  __updateState(): any {
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
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

  _propStateChange: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this._propStateChange = (e: any) => {
      this.propStateChange.emit(e);
      this._detectChanges();
    };
  }
  set _innerState(innerState: number) {
    this.innerState = innerState;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
