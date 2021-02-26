import { Input, TemplateRef } from "@angular/core";
export class Props {
  @Input() contentTemplate: TemplateRef<any> | null = null;
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
  selector: "dx-test-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["contentTemplate"],
  template: `<ng-container
      *ngTemplateOutlet="contentTemplate || contentTemplateDefault"
    >
    </ng-container>
    <ng-template #contentTemplateDefault>
      <div></div>
    </ng-template>`,
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

  constructor(private changeDetection: ChangeDetectorRef) {
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
