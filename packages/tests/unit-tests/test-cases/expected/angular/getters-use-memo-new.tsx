const buttonClass = "my-buttom";

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
    if (this.__getterCache["classes"] !== undefined) {
      return this.__getterCache["classes"];
    }
    return (this.__getterCache["classes"] = ((): any => {
      return this.className ? `${buttonClass} ${this.className}` : buttonClass;
    })());
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

  __getterCache: {
    classes?: any;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["className"].some((d) => changes[d])) {
      this.__getterCache["classes"] = undefined;
    }
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
