import { Input } from "@angular/core";
export class TemplateComponentProps {
  @Input() props: number = 0;
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
  selector: "dx-template-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["props"],
  template: `<div>template_component</div>`,
})
export class TemplateComponent extends TemplateComponentProps {
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
  declarations: [TemplateComponent],
  imports: [CommonModule],

  exports: [TemplateComponent],
})
export class DxTemplateComponentModule {}
export { TemplateComponent as DxTemplateComponentComponent };
export default TemplateComponent;
