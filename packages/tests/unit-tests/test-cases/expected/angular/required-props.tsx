import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class WidgetInput {
  @Input() size!: { width: number; height: number };
  @Input() type!: string;
}

import {
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
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from "../../../../jquery-helpers/default_options";

type WidgetOptionRule = DefaultOptionsRule<Partial<WidgetInput>>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["size", "type"],
  template: ``,
})
export default class Widget extends WidgetInput {
  get __getHeight(): number {
    return this.size.height;
  }
  get __type(): string {
    const { type } = this;
    return type;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();

    const defaultOptions =
      convertRulesToOptions<WidgetInput>(__defaultOptionRules);
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
