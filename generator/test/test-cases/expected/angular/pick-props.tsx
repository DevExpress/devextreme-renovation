import Props, { Options } from "./component-bindings-only";
import { Input } from "@angular/core";
import { AdditionalOptions } from "./component-bindings-only";
class WidgetProps {
  @Input() data?: Options = new Props().data;
  @Input() info?: AdditionalOptions = new Props().info;
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
  template: `<div>
    {{
      model.props.data === undefined || model.props.data === null
        ? undefined
        : model.props.data.value
    }}
  </div>`,
})
export default class Widget extends WidgetProps {
  innerData: Options = { value: "" };
  get __restAttributes(): any {
    return {};
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  set _innerData(innerData: Options) {
    this.innerData = innerData;
    this.changeDetection.detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
