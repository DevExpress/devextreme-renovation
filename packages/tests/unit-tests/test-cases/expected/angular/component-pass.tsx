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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["mode", "firstText", "secondText"],
  template: `<dx-widget-one [text]="firstText" *ngIf="mode" #widgetone13
      ><div>Slot content</div></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone13.widgetTemplate"></ng-content
    ><dx-widget-two [text]="firstText" *ngIf="!mode" #widgettwo14
      ><div>Slot content</div></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo14.widgetTemplate"></ng-content
    ><dx-widget-one [text]="secondText" #widgetone15
      ><div>Children go here</div></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone15.widgetTemplate"></ng-content
    ><dx-widget-one
      text="self closing by condition"
      *ngIf="mode"
      #widgetone16
    ></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone16.widgetTemplate"></ng-content
    ><dx-widget-two
      text="self closing by condition"
      *ngIf="!mode"
      #widgettwo17
    ></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo17.widgetTemplate"></ng-content
    ><dx-widget-two text="self closing" #widgettwo18></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo18.widgetTemplate"></ng-content
    ><dx-widget-one
      [text]="secondText"
      *ngIf="mode"
      #widgetone19
    ></dx-widget-one
    ><ng-content *ngTemplateOutlet="widgetone19.widgetTemplate"></ng-content
    ><dx-widget-two
      [text]="secondText"
      *ngIf="!mode"
      #widgettwo20
    ></dx-widget-two
    ><ng-content *ngTemplateOutlet="widgettwo20.widgetTemplate"></ng-content>`,
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
