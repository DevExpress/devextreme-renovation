import { Input } from "@angular/core";
export class WidgetWithRefPropInput {
  @Input() parentRef?: any;
  @Input() nullableRef?: any;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-ref-prop",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div></div>`,
})
export default class WidgetWithRefProp extends WidgetWithRefPropInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithRefProp],
  imports: [CommonModule],
  exports: [WidgetWithRefProp],
})
export class DxWidgetWithRefPropModule {}
