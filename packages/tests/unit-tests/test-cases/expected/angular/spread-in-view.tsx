import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  template: '',
})
export class WidgetProps {
  @Input() a: Array<Number> = [1, 2, 3];
  @Input() id: string = '1';
  @Output() onClick: EventEmitter<any> = new EventEmitter();
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  ElementRef,
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
  inputs: ['a', 'id'],
  outputs: ['onClick'],
  template: `<ng-template #widgetTemplate
    ><div #_auto_ref_0></div
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;

  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  get rest(): any {
    return { id: this.id, onClick: this._onClick };
  }
  @ViewChild('_auto_ref_0', { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.rest || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (['id', 'onClick'].some((d) => changes[d] && !changes[d].firstChange)) {
      this.scheduledApplyAttributes = true;
    }
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  _onClick: any;
  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ['a', 'id'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
    this._onClick = (e: any) => {
      this.onClick.emit(e);
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
