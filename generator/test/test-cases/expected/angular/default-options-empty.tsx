import "typescript";
function view() {}

export class WidgetProps {}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  convertRulesToOptions,
  Rule,
} from "../../../../component_declaration/default_options";
type WidgetOptionRule = Rule<Partial<WidgetProps>>;

const __defaultOptionRules: WidgetOptionRule[] = [
  { device: true, options: {} },
];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({ selector: "dx-widget" })
export default class Widget extends WidgetProps {
  get __restAttributes(): any {
    return {};
  }

  constructor() {
    super();

    const defaultOptions = convertRulesToOptions<WidgetProps>(
      __defaultOptionRules
    );
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
