import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import {
  PublicWidgetWithProps,
  WidgetWithPropsInput,
  DxPublicWidgetWithPropsModule,
} from "./dx-public-widget-with-props";
import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
export class DateTableBodyProps {
  @Input() cellTemplate: TemplateRef<any> | null = null;
  @Input() rows: string[][] = [];
}

import {
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
  selector: "dx-date-table-body",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["cellTemplate", "rows"],
  template: `<ng-template #widgetTemplate
    ><ng-container *ngFor="let cells of rows"
      ><dx-widget-with-props #widgetwithprops6 style="display: contents"
        ><ng-container *ngFor="let value of cells"
          ><ng-container
            *ngTemplateOutlet="
              cellTemplate || cellTemplateDefault;
              context: { value: value }
            "
          >
          </ng-container></ng-container></dx-widget-with-props
      ><ng-content
        *ngTemplateOutlet="widgetwithprops6?.widgetTemplate"
      ></ng-content></ng-container
    ><ng-template #cellTemplateDefault let-value="value">
      <dx-public-widget-with-props
        #compRef
        style="display: contents"
        [value]="
          value !== undefined ? value : PublicWidgetWithPropsDefaults.value
        "
        [_private]="true"
      ></dx-public-widget-with-props>
      <ng-content
        *ngTemplateOutlet="compRef?.widgetTemplate"
      ></ng-content> </ng-template
  ></ng-template>`,
})
export class DateTableBody extends DateTableBodyProps {
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new DateTableBodyProps() as { [key: string]: any };
    this.defaultEntries = ["rows"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }

  PublicWidgetWithPropsDefaults = { value: "default text", number: 42 };
}
@NgModule({
  declarations: [DateTableBody],
  imports: [
    DxWidgetWithPropsModule,
    DxPublicWidgetWithPropsModule,
    CommonModule,
  ],
  entryComponents: [WidgetWithProps, PublicWidgetWithProps],
  exports: [DateTableBody],
})
export class DxDateTableBodyModule {}
export { DateTableBody as DxDateTableBodyComponent };
export default DateTableBody;
