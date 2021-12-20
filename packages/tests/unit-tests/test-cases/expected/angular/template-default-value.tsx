import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Injectable, Input, TemplateRef } from "@angular/core";
@Injectable()
export class TemplateDefaultValueProps {
  @Input() defaultCompTemplate: TemplateRef<any> | null = null;
  @Input() defaultFuncTemplate: TemplateRef<any> | null = null;
  @Input() stringToRender: string = "strCompDefault";
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-template-default-value",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["defaultCompTemplate", "defaultFuncTemplate", "stringToRender"],
  template: `<ng-template #widgetTemplate
    ><div
      >TemplateDefaultValue<ng-container
        *ngTemplateOutlet="
          defaultCompTemplate || defaultCompTemplateDefault;
          context: { optionalValue: stringToRender, value: 'twdComp' }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          defaultCompTemplate || defaultCompTemplateDefault;
          context: { value: stringToRender }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          defaultFuncTemplate || defaultFuncTemplateDefault;
          context: { value: stringToRender }
        "
      >
      </ng-container></div
    ><ng-template
      #defaultCompTemplateDefault
      let-optionalValue="optionalValue"
      let-value="value"
    >
      <dx-widget-with-props
        #compRef
        optionalValue
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
      ></dx-widget-with-props>
      <ng-content *ngTemplateOutlet="compRef?.widgetTemplate"></ng-content>
    </ng-template>
    <ng-template #defaultFuncTemplateDefault let-value="value">
      <div
        >!DefaultFunc:{{ value || "ftwdCompDefault" }}{{ optionalValue }}</div
      >
    </ng-template></ng-template
  >`,
})
export default class TemplateDefaultValue extends TemplateDefaultValueProps {
  defaultEntries: DefaultEntries;
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
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new TemplateDefaultValueProps() as {
      [key: string]: any;
    };
    this.defaultEntries = ["stringToRender"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }

  WidgetWithPropsDefaults = {
    value: "default text",
    number: 42,
    onClick: (e: any) => void 0,
  };
}
@NgModule({
  declarations: [TemplateDefaultValue],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
