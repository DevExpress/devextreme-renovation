import Props from "./component-bindings-only";
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from "../../../../jquery-helpers/default_options";

type WidgetOptionRule = DefaultOptionsRule<Partial<Props>>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height", "data", "info"],
  template: `<div>{{ height }}</div>`,
})
export default class Widget extends Props {
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

    const defaultOptions = convertRulesToOptions<Props>(__defaultOptionRules);
    Object.keys(defaultOptions).forEach((option) => {
      (this as any)[option] = (defaultOptions as any)[option];
    });
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
