import WidgetOne, { DxWidgetOneModule } from "./component-pass-one";
import { WidgetTwo, DxWidgetTwoModule } from "./component-pass-two";
import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class WidgetProps {
  @Input() mode?: boolean = false;
  @Input() firstText?: string;
  @Input() secondText?: string;
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
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["mode", "firstText", "secondText"],
  template: `<ng-template #widgetTemplate
    ><ng-container *ngIf="mode"
      ><dx-widget-one [text]="firstText" #widgetone1 style="display: contents"
        ><div>Slot content</div></dx-widget-one
      ><ng-content
        *ngTemplateOutlet="widgetone1?.widgetTemplate"
      ></ng-content></ng-container
    ><ng-container *ngIf="!mode"
      ><dx-widget-two [text]="firstText" #widgettwo1 style="display: contents"
        ><div>Slot content</div></dx-widget-two
      ><ng-content
        *ngTemplateOutlet="widgettwo1?.widgetTemplate"
      ></ng-content></ng-container
    ><dx-widget-one [text]="secondText" #widgetone2 style="display: contents"
      ><div>Children go here</div></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone2?.widgetTemplate"></ng-content
    ><ng-container *ngIf="mode"
      ><dx-widget-one
        text="self closing by condition"
        #widgetone3
        style="display: contents"
      ></dx-widget-one
      ><ng-content
        *ngTemplateOutlet="widgetone3?.widgetTemplate"
      ></ng-content></ng-container
    ><ng-container *ngIf="!mode"
      ><dx-widget-two
        text="self closing by condition"
        #widgettwo2
        style="display: contents"
      ></dx-widget-two
      ><ng-content
        *ngTemplateOutlet="widgettwo2?.widgetTemplate"
      ></ng-content></ng-container
    ><dx-widget-two
      text="self closing"
      #widgettwo3
      style="display: contents"
    ></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo3?.widgetTemplate"></ng-content
    ><ng-container *ngIf="mode"
      ><dx-widget-one
        [text]="secondText"
        #widgetone4
        style="display: contents"
      ></dx-widget-one
      ><ng-content
        *ngTemplateOutlet="widgetone4?.widgetTemplate"
      ></ng-content></ng-container
    ><ng-container *ngIf="!mode"
      ><dx-widget-two
        [text]="secondText"
        #widgettwo4
        style="display: contents"
      ></dx-widget-two
      ><ng-content
        *ngTemplateOutlet="widgettwo4?.widgetTemplate"
      ></ng-content></ng-container
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
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
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ["mode"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetOneModule, DxWidgetTwoModule, CommonModule],
  entryComponents: [WidgetOne, WidgetTwo],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
