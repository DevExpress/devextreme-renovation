import { Input } from "@angular/core";
class WidgetInput {
  @Input() size!: { width: number; height: number };
  @Input() type!: string;
}

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
  Rule,
} from "../../../../jquery-helpers/default_options";

type WidgetOptionRule = Rule<Partial<WidgetInput>>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["size", "type"],
})
export default class Widget extends WidgetInput {
  get __getHeight(): number {
    if (this.__getterCache["getHeight"] !== undefined) {
      return this.__getterCache["getHeight"];
    }
    return (this.__getterCache["getHeight"] = ((): number => {
      return this.size.height;
    })());
  }
  get __type(): string {
    if (this.__getterCache["type"] !== undefined) {
      return this.__getterCache["type"];
    }
    return (this.__getterCache["type"] = ((): string => {
      const { type } = this;
      return type;
    })());
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

  __getterCache: {
    getHeight?: number;
    type?: string;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["size"].some((d) => changes[d])) {
      this.__getterCache["getHeight"] = undefined;
    }

    if (["type"].some((d) => changes[d])) {
      this.__getterCache["type"] = undefined;
    }
  }

  constructor(private changeDetection: ChangeDetectorRef) {
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
