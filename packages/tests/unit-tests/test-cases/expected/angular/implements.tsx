import BaseProps from "./component-bindings-only";
interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

import { Input } from "@angular/core";
class WidgetInput extends BaseProps {
  @Input() p: string = "10";
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
  inputs: ["p", "height", "data", "info"],
  template: `<span></span>`,
})
export default class Widget extends WidgetInput {
  __onClick(): void {}
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
