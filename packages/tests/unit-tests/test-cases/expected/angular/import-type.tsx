import type { Options } from "./types.d";
import type { CustomClass } from "./types.d";
import { Injectable, Input } from "@angular/core";
@Injectable()
export class ImportProps {
  @Input() Test?: Options;
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
  selector: "dx-import",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["Test"],
  template: `<ng-template #widgetTemplate
    ><div>{{
      Test === undefined || Test === null ? undefined : Test.value
    }}</div></ng-template
  >`,
})
export default class Import extends ImportProps {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
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
}
@NgModule({
  declarations: [Import],
  imports: [CommonModule],

  exports: [Import],
})
export class DxImportModule {}
export { Import as DxImportComponent };
