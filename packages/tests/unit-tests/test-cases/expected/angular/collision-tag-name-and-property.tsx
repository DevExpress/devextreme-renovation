import { Input } from "@angular/core";
export class TextSvgElementProps {
  @Input() text?: string | null = "";
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
  selector: "g [TextSvgElement]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["text"],
  template: `<ng-template #widgetTemplate
    ><svg:text>
      <svg:ng-container *ngIf="![].length">
        {{ __computedProps.text }}
      </svg:ng-container>
    </svg:text></ng-template
  >`,
})
export class TextSvgElement extends TextSvgElementProps {
  get __computedProps(): TextSvgElementProps {
    return this;
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
  declarations: [TextSvgElement],
  imports: [CommonModule],

  exports: [TextSvgElement],
})
export class DxTextSvgElementModule {}
export { TextSvgElement as DxTextSvgElementComponent };
export default TextSvgElement;
