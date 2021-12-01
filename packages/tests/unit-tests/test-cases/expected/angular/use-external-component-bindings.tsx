import Props from "./component-bindings-only";
import {
  Component,
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

type WidgetOptionRule = DefaultOptionsRule<Partial<Props>>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height", "data", "info"],
  template: `<ng-template #widgetTemplate
    ><div>{{ height }}</div></ng-template
  >`,
})
export default class Widget extends Props {
  propsDefaults = new Props();
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    if (changes["height"] && changes["height"].currentValue === undefined) {
      this.height = this.propsDefaults.height;
    }
    if (changes["data"] && changes["data"].currentValue === undefined) {
      this.data = this.propsDefaults.data;
    }
    if (changes["info"] && changes["info"].currentValue === undefined) {
      this.info = this.propsDefaults.info;
    }
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
