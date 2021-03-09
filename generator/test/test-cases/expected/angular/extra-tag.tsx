import SvgGraphicsProps from "./base_graphics_props";
import { Input } from "@angular/core";
export class TextSvgElementProps extends SvgGraphicsProps {
  @Input() text?: string | null = "";
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
  selector: "g [TextSvgElement]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["text"],
  template: `<svg:text>
    <svg:ng-container *ngIf="![].length">{{ text }}</svg:ng-container>
  </svg:text>`,
})
export class TextSvgElement extends TextSvgElementProps {
  get __computedProps(): TextSvgElementProps {
    if (this.__getterCache["computedProps"] !== undefined) {
      return this.__getterCache["computedProps"];
    }
    return (this.__getterCache["computedProps"] = ((): TextSvgElementProps => {
      return this;
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
    computedProps?: TextSvgElementProps;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    this.__getterCache["computedProps"] = undefined;
  }

  constructor(private changeDetection: ChangeDetectorRef) {
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
