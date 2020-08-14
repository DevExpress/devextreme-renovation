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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span></span>`,
})
export default class Widget extends WidgetInput {
  __onClick(): void {}
  get __restAttributes(): any {
    return {};
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
