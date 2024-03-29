import { InnerLayout as Child, DxInnerLayoutModule } from './inner-layout';
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class Props {
  @Input() prop: number = 0;
  @Input() rf?: Child;
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
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-extra-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['prop', 'rf'],
  template: `<ng-template #widgetTemplate>
      <pre><ng-container *ngIf="rf"><dx-inner-layout #rf
[prop]="3"
style="display: contents"
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="rf?.widgetTemplate"></ng-content></ng-container><div id="firstDiv"></div><dx-inner-layout #rf
[prop]="4"
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="rf?.widgetTemplate"></ng-content><div id="secondDiv"></div><dx-inner-layout [prop]="2"
#child1
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="child1?.widgetTemplate"></ng-content><div id="thirdDiv"></div><dx-inner-layout [prop]="1"
#child2
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="child2?.widgetTemplate"></ng-content></pre>
    </ng-template>
    <ng-container
      *ngTemplateOutlet="_private ? null : widgetTemplate"
    ></ng-container>`,
})
export class ExtraElement extends Props {
  defaultEntries: DefaultEntries;

  @Input() _private = false;
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    this._elementRef.nativeElement.removeAttribute('id');
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
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

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super();
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ['prop'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [ExtraElement],
  imports: [DxInnerLayoutModule, CommonModule],
  entryComponents: [Child],
  exports: [ExtraElement],
})
export class DxExtraElementModule {}
export { ExtraElement as DxExtraElementComponent };
export default ExtraElement;
