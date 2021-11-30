import { Injectable, Input } from "@angular/core";
@Injectable()
export class TextSvgElementProps {
  __textInternalValue?: string | null = "";
  @Input()
  set text(value: string | null | undefined) {
    if (value !== undefined) this.__textInternalValue = value;
    else this.__textInternalValue = "";
  }
  get text() {
    return this.__textInternalValue;
  }
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
  template: `<svg:text>
    <svg:ng-container *ngIf="![].length">
      {{ __computedProps.text }}
    </svg:ng-container>
  </svg:text>`,
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
  declarations: [TextSvgElement],
  imports: [CommonModule],

  exports: [TextSvgElement],
})
export class DxTextSvgElementModule {}
export { TextSvgElement as DxTextSvgElementComponent };
export default TextSvgElement;
