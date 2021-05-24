import { Input } from "@angular/core";
class WidgetInput {
  @Input() prop1?: number;
  @Input() prop2?: number;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop1", "prop2"],
  template: `<div #divRefLink></div>`,
})
export default class Widget extends WidgetInput {
  @ViewChild("divRefLink", { static: false })
  divRef!: ElementRef<HTMLDivElement>;
  getHeight(p: number = 10, p1: any): string {
    return `${this.prop1} + ${this.prop2} + ${this.divRef.nativeElement?.innerHTML} + ${p}`;
  }
  getSize(): string {
    return `${this.prop1} + ${
      this.divRef.nativeElement?.innerHTML
    } + ${this.getHeight(0, 0)}`;
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

  constructor(private changeDetection: ChangeDetectorRef) {
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
