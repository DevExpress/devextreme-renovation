const buttonClass = "my-buttom";
const getClasses = (className?: string) => {
  return className ? `${buttonClass} ${className}` : buttonClass;
};

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
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-button",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["className"],
  template: `<ng-template #widgetTemplate
    ><button [class]="classes">My Button</button></ng-template
  >`,
})
export default class Button {
  @Input() className?: string;
  get classes(): any {
    return getClasses(this.className);
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
  ) {}
}
@NgModule({
  declarations: [Button],
  imports: [CommonModule],

  exports: [Button],
})
export class DxButtonModule {}
export { Button as DxButtonComponent };
