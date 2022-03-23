import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  template: '',
})
class WidgetInput {
  @Input() height: number = 10;
  @Input() selected: boolean = false;
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter();
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
  inputs: ['height', 'selected'],
  outputs: ['selectedChange'],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends WidgetInput {
  defaultEntries: DefaultEntries;

  __getHeight(): number {
    const { height } = this;
    const { height: _height } = this;
    return height + _height;
  }
  __getProps(): any {
    return {
      height: this.height,
      selected: this.selected,
      selectedChange: this._selectedChange,
    };
  }
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

  _selectedChange: any;
  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ['height', 'selected'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
    this._selectedChange = (e: any) => {
      this.selectedChange.emit(e);

      this._detectChanges();
    };
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
