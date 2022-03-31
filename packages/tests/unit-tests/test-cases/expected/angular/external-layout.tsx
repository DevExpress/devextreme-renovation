import { InnerLayout, DxInnerLayoutModule } from './inner-layout';
import { InnerComponent, DxInnerComponentModule } from './inner-component';
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class Props {
  @Input() prop: number = 0;
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

import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';

@Component({
  selector: 'dx-external-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['prop'],
  template: `<ng-template #widgetTemplate
    ><dx-inner-layout
      [innerComponentTemplate]="InnerComponent"
      #innerlayout1
      style="display: contents"
      ><ng-template #InnerComponent let-someTemplate="someTemplate"
        ><dx-inner-component
          [someTemplate]="
            someTemplate !== undefined
              ? someTemplate
              : InnerComponentDefaults.someTemplate
          "
          #innercomponent1
          style="display: contents"
        ></dx-inner-component
        ><ng-content
          *ngTemplateOutlet="innercomponent1?.widgetTemplate"
        ></ng-content></ng-template></dx-inner-layout
    ><ng-content *ngTemplateOutlet="innerlayout1?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export class ExternalLayout extends Props {
  defaultEntries: DefaultEntries;

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
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ['prop'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }

  InnerComponentDefaults = { someTemplate: InnerWidget };
}
@NgModule({
  declarations: [ExternalLayout],
  imports: [
    DxInnerLayoutModule,
    DxInnerComponentModule,
    CommonModule,
    DxInnerWidgetModule,
  ],
  entryComponents: [InnerLayout, InnerComponent, InnerWidget],
  exports: [ExternalLayout],
})
export class DxExternalLayoutModule {}
export { ExternalLayout as DxExternalLayoutComponent };
export default ExternalLayout;
