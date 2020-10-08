import { Input, TemplateRef } from "@angular/core";
export class TemplateDefaultValueProps {
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() stringToRender: string = "default string";
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
} from "../../../../component_declaration/default_options";

type TemplateDefaultValueOptionRule = Rule<Partial<TemplateDefaultValueProps>>;

const __defaultOptionRules: TemplateDefaultValueOptionRule[] = [];
export function defaultOptions(rule: TemplateDefaultValueOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-template-default-value",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    >TemplateDefaultValue<ng-container
      *ngTemplateOutlet="
        contentTemplate || contentTemplateDefault;
        context: { data: { p1: stringToRender } }
      "
    ></ng-container>
    <ng-template #contentTemplateDefault let-data="data"
      ><span>{{ data.p1 }}</span></ng-template
    ></div
  >`,
})
export default class TemplateDefaultValue extends TemplateDefaultValueProps {
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

    const defaultOptions = convertRulesToOptions<TemplateDefaultValueProps>(
      __defaultOptionRules
    );
    Object.keys(defaultOptions).forEach((option) => {
      (this as any)[option] = (defaultOptions as any)[option];
    });
  }
}
@NgModule({
  declarations: [TemplateDefaultValue],
  imports: [CommonModule],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
