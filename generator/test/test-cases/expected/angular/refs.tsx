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
  template: `<div #divRef>
    <div #explicitRef><div #nullableRef></div></div>
  </div>`,
})
export default class Widget {
  @ViewChild("divRef", { static: false }) divRef!: ElementRef<HTMLDivElement>;
  @ViewChild("nullableRef", { static: false }) nullableRef?: ElementRef<
    HTMLDivElement
  >;
  @ViewChild("explicitRef", { static: false }) explicitRef!: ElementRef<
    HTMLDivElement
  >;
  __clickHandler(): any {
    const html =
      this.divRef.nativeElement.outerHTML +
      this.explicitRef.nativeElement!.outerHTML;
    this.divRef.nativeElement = this.explicitRef.nativeElement;
  }
  __getHeight(): any {
    return (
      this.divRef.nativeElement.outerHTML +
      this.nullableRef?.nativeElement?.outerHTML
    );
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

  constructor(private changeDetection: ChangeDetectorRef) {}
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
