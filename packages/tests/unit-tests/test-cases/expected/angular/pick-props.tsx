import Props from './component-bindings-only';
import { Options } from './types.d';
import { Component, Input } from '@angular/core';
import { AdditionalOptions } from './types.d';
@Component({
  template: '',
})
class WidgetProps {
  @Input() data?: Options = new Props().data;
  @Input() info?: AdditionalOptions = new Props().info;
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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['data', 'info'],
  template: `<ng-template #widgetTemplate
    ><div>{{
      data === undefined || data === null ? undefined : data.value
    }}</div></ng-template
  >`,
})
export default class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;

  innerData: Options = { value: '' };
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ['data', 'info'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
  set _innerData(innerData: Options) {
    this.innerData = innerData;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
