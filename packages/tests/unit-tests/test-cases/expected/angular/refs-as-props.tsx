import WidgetWithRefProp, {
  DxWidgetWithRefPropModule,
} from './dx-widget-with-ref-prop';
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
class WidgetInput {
  @Input() nullableRef?: HTMLDivElement;
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
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UndefinedNativeElementRef,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['nullableRef'],
  template: `<ng-template #widgetTemplate
    ><div #divRefLink
      ><dx-widget-with-ref-prop
        [parentRef]="divRefLink"
        [nullableRef]="nullableRef"
        #widgetwithrefprop1
        style="display: contents"
      ></dx-widget-with-ref-prop
      ><ng-content
        *ngTemplateOutlet="widgetwithrefprop1?.widgetTemplate"
      ></ng-content></div
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
  @ViewChild('divRefLink', { static: false })
  __divRef!: ElementRef<HTMLDivElement>;
  get divRef(): ElementRef<HTMLDivElement> {
    return this.__divRef
      ? this.__divRef
      : new UndefinedNativeElementRef<HTMLDivElement>();
  }
  __getDirectly(): any {
    const divRefOuter = this.divRef.nativeElement?.outerHTML ?? '';
    const nullableRefOuter = this.nullableRef?.outerHTML ?? '';
    return divRefOuter + nullableRefOuter;
  }
  __getDestructed(): any {
    const divRefOuter = this.divRef.nativeElement?.outerHTML ?? '';
    const nullableRefOuter = this.nullableRef?.outerHTML ?? '';
    return divRefOuter + nullableRefOuter;
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
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetWithRefPropModule, CommonModule],
  entryComponents: [WidgetWithRefProp],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
