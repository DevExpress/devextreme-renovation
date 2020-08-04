function view() {}

import { Input } from "@angular/core";
class WidgetInput {
  @Input() size?: { width: number; height: number } = { width: 10, height: 20 };
  @Input() type?: string = "type";
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  convertRulesToOptions,
  Rule,
} from "../../../../component_declaration/default_options";
type WidgetOptionRule = Rule<Partial<WidgetInput>>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
  get __getHeight(): number {
    return this.size!.height;
  }
  get __type(): string {
    return this.type!;
  }
  get __restAttributes(): any {
    return {};
  }

  constructor() {
    super();

    const defaultOptions = convertRulesToOptions<WidgetInput>(
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
