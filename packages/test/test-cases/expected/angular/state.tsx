import BaseState, { DxModelWidgetModule } from "./model";
import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() state1?: boolean = false;
  @Input() state2: boolean = false;
  @Input() stateProp?: boolean;
  @Output() state1Change: EventEmitter<
    boolean | undefined
  > = new EventEmitter();
  @Output() state2Change: EventEmitter<boolean> = new EventEmitter();
  @Output() statePropChange: EventEmitter<
    boolean | undefined
  > = new EventEmitter();
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
  inputs: ["state1", "state2", "stateProp"],
  outputs: ["state1Change", "state2Change", "statePropChange"],
  template: `<div
    >{{ state1
    }}<dx-model-widget
      (baseStatePropChange)="__stateChange($event)"
    ></dx-model-widget
  ></div>`,
})
export default class Widget extends WidgetInput {
  innerData?: string;
  __updateState(): any {
    this._state1Change((this.state1 = !this.state1));
  }
  __updateState2(): any {
    const cur = this.state2;
    this._state2Change((this.state2 = cur !== false ? false : true));
  }
  __destruct(): any {
    const { state1 } = this;
    const s = state1;
  }
  __stateChange(stateProp?: boolean): any {
    this._statePropChange((this.stateProp = stateProp));
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

  _state1Change: any;
  _state2Change: any;
  _statePropChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._state1Change = (e: any) => {
      this.state1Change.emit(e);
      this._detectChanges();
    };
    this._state2Change = (e: any) => {
      this.state2Change.emit(e);
      this._detectChanges();
    };
    this._statePropChange = (e: any) => {
      this.statePropChange.emit(e);
      this._detectChanges();
    };
  }
  set _innerData(innerData: string) {
    this.innerData = innerData;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [DxModelWidgetModule, CommonModule],
  entryComponents: [BaseState],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
