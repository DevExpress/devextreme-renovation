import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: "dx-widget",
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
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
