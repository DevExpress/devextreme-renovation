import WidgetOne, { DxWidgetOneModule } from "./component-pass-one";
import { WidgetTwo, DxWidgetTwoModule } from "./component-pass-two";
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() mode?: boolean = false;
  @Input() firstText?: string;
  @Input() secondText?: string;
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
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["mode", "firstText", "secondText"],
  template: `<ng-template #widgetTemplate
    ><dx-widget-one [text]="firstText" *ngIf="mode" #widgetone1
      ><div>Slot content</div></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone1?.widgetTemplate"></ng-content
    ><dx-widget-two [text]="firstText" *ngIf="!mode" #widgettwo1
      ><div>Slot content</div></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo1?.widgetTemplate"></ng-content
    ><dx-widget-one [text]="secondText" #widgetone2
      ><div>Children go here</div></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone2?.widgetTemplate"></ng-content
    ><dx-widget-one
      text="self closing by condition"
      *ngIf="mode"
      #widgetone3
    ></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone3?.widgetTemplate"></ng-content
    ><dx-widget-two
      text="self closing by condition"
      *ngIf="!mode"
      #widgettwo2
    ></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo2?.widgetTemplate"></ng-content
    ><dx-widget-two text="self closing" #widgettwo3></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo3?.widgetTemplate"></ng-content
    ><dx-widget-one [text]="secondText" *ngIf="mode" #widgetone4></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone4?.widgetTemplate"></ng-content
    ><dx-widget-two
      [text]="secondText"
      *ngIf="!mode"
      #widgettwo4
    ></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo4?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: false })
  widgetTemplate: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
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
