import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
export class Props {
  @Input() contentTemplate: TemplateRef<any> | null = null;
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

@Component({
  selector: "dx-test-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["contentTemplate"],
  template: `<ng-template #widgetTemplate
    ><ng-container
      *ngTemplateOutlet="contentTemplate || contentTemplateDefault"
    >
    </ng-container>
    <ng-template #contentTemplateDefault>
      <div></div> </ng-template
  ></ng-template>`,
})
export class TestComponent extends Props {
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
  declarations: [TestComponent],
  imports: [CommonModule],

  exports: [TestComponent],
})
export class DxTestComponentModule {}
export { TestComponent as DxTestComponentComponent };
export default TestComponent;
