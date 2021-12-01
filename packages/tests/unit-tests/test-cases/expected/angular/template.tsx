import {
  PublicWidgetWithProps,
  DxPublicWidgetWithPropsModule,
} from "./dx-public-widget-with-props";
import {
  WidgetWithProps,
  WidgetWithPropsInput,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";

import { Injectable, Input, TemplateRef } from "@angular/core";
@Injectable()
export class WidgetInput {
  @Input() someProp: boolean = false;
  @Input() headerTemplate: TemplateRef<any> | null = null;
  @Input() template: TemplateRef<any> | null = null;
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() footerTemplate: TemplateRef<any> | null = null;
  @Input() componentTemplate: TemplateRef<any> | null = null;
  @Input() publicComponentTemplate: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: "dx-widget-with-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "someProp",
    "headerTemplate",
    "template",
    "contentTemplate",
    "footerTemplate",
    "componentTemplate",
    "publicComponentTemplate",
  ],
  template: `<ng-template #widgetTemplate
    ><div
      ><ng-container
        *ngTemplateOutlet="headerTemplate || headerTemplateDefault"
      >
      </ng-container
      ><ng-container *ngIf="contentTemplate">
        <ng-container
          *ngTemplateOutlet="
            contentTemplate || contentTemplateDefault;
            context: { data: { p1: 'value' }, index: 10 }
          "
        >
        </ng-container> </ng-container
      ><ng-container *ngIf="!contentTemplate">
        <ng-container
          *ngTemplateOutlet="
            template || templateDefault;
            context: {
              textProp: 'textPropValue',
              textPropExpr: 'textPropExrpValue'
            }
          "
        >
        </ng-container> </ng-container
      ><ng-container *ngIf="footerTemplate">
        <ng-container
          *ngTemplateOutlet="
            footerTemplate || footerTemplateDefault;
            context: { someProp: someProp }
          "
        >
        </ng-container> </ng-container
      ><ng-container
        *ngTemplateOutlet="
          componentTemplate || componentTemplateDefault;
          context: { value: 'Test Value' }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          publicComponentTemplate || publicComponentTemplateDefault;
          context: { value: 'Test Value' }
        "
      >
      </ng-container
    ></div>
    <ng-template #headerTemplateDefault>
      {{ null }}
    </ng-template>
    <ng-template #contentTemplateDefault let-data="data" let-index="index">
      <div>{{ data.p1 }}</div>
    </ng-template>
    <ng-template
      #templateDefault
      let-textProp="textProp"
      let-textPropExpr="textPropExpr"
    >
      <div></div>
    </ng-template>
    <ng-template #footerTemplateDefault let-someProp="someProp">
      <div></div> </ng-template
    ><ng-template #componentTemplateDefault let-value="value">
      <dx-widget-with-props
        #compRef
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
      ></dx-widget-with-props>
      <ng-content
        *ngTemplateOutlet="compRef?.widgetTemplate"
      ></ng-content> </ng-template
    ><ng-template #publicComponentTemplateDefault let-value="value">
      <dx-public-widget-with-props
        #compRef
        [value]="
          value !== undefined ? value : PublicWidgetWithPropsDefaults.value
        "
      ></dx-public-widget-with-props> </ng-template
  ></ng-template>`,
})
export default class WidgetWithTemplate extends WidgetInput {
  propsDefaults = new WidgetInput();
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
    if (changes["someProp"] && changes["someProp"].currentValue === undefined) {
      this.someProp = this.propsDefaults.someProp;
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
  }

  WidgetWithPropsDefaults = {
    value: "default text",
    number: 42,
    onClick: (e: any) => void 0,
  };
  PublicWidgetWithPropsDefaults = {
    value: "default text",
    number: 42,
    onClick: (e: any) => void 0,
  };
}
@NgModule({
  declarations: [WidgetWithTemplate],
  imports: [
    DxPublicWidgetWithPropsModule,
    DxWidgetWithPropsModule,
    CommonModule,
  ],
  entryComponents: [PublicWidgetWithProps, WidgetWithProps],
  exports: [WidgetWithTemplate],
})
export class DxWidgetWithTemplateModule {}
export { WidgetWithTemplate as DxWidgetWithTemplateComponent };
