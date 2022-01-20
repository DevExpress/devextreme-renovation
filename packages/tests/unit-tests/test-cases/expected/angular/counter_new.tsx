import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class CounterInput {
  @Input() id?: string;
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

@Component({
  selector: "dx-counter",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["id"],
  template: `<ng-template #widgetTemplate
    ><button [id]="id" [onClick]="onClick">{{ value }}</button></ng-template
  >`,
})
export default class Counter extends CounterInput {
  value: number = 1;
  setValue(__val__: any): void {
    this.value = __val__;
    this._detectChanges();
  }
  onClick(): any {
    this.setValue(this.value + 1);
  }
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
  declarations: [Counter],
  imports: [CommonModule],

  exports: [Counter],
})
export class DxCounterModule {}
export { Counter as DxCounterComponent };
