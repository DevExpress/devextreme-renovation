type EventCallBack<Type> = (e: Type) => void;

import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class WidgetInput {
  @Input() someProp?: { current: string };
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

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['someProp'],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends WidgetInput {
  someState?: { current: string };
  existsState: { current: string } = { current: 'value' };
  __concatStrings(): any {
    const fromProps = this.someProp?.current || '';
    const fromState = this.someState?.current || '';
    return `${fromProps}${fromState}${this.existsState.current}`;
  }
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
  }
  set _someState(someState: { current: string }) {
    this.someState = someState;
    this._detectChanges();
  }
  set _existsState(existsState: { current: string }) {
    this.existsState = existsState;
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
