import BaseProps from "./component-bindings-only";
export interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

import { Injectable, Input } from "@angular/core";
@Injectable()
class WidgetInput extends BaseProps {
  @Input() p: string = "10";
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
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["p", "height", "data", "info"],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends WidgetInput {
  __onClick(): void {}
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    if (changes["p"] && changes["p"].currentValue === undefined) {
      this.p = "10";
    }
    if (changes["height"] && changes["height"].currentValue === undefined) {
      this.height = 10;
    }
    if (changes["data"] && changes["data"].currentValue === undefined) {
      this.data = { value: "" };
    }
    if (changes["info"] && changes["info"].currentValue === undefined) {
      this.info = { index: 0 };
    }
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
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
