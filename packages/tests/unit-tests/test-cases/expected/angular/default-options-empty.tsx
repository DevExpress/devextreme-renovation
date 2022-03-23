import { Component } from '@angular/core';
@Component({
  template: '',
})
export class WidgetProps {}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';

type WidgetOptionRule = DefaultOptionsRule<Partial<WidgetProps>>;

const __defaultOptionRules: WidgetOptionRule[] = [
  { device: true, options: {} },
];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetProps {
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();

    const defaultOptions =
      convertRulesToOptions<WidgetProps>(__defaultOptionRules);
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
