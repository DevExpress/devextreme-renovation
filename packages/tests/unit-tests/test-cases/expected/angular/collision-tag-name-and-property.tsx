import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class TextSvgElementProps {
  @Input() text?: string | null = "";
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

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
  defaultEntries: DefaultEntries;
  get __computedProps(): TextSvgElementProps {
    return this;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new TextSvgElementProps() as { [key: string]: any };
    this.defaultEntries = ["text"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
