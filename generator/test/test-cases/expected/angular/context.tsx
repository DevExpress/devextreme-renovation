import { Injectable, SkipSelf, Host } from "@angular/core";
@Injectable()
class P1Context {
  public value: number = 5;
}

import { Input } from "@angular/core";
class Props {
  @Input() p1: number = 10;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<span></span>`,
  providers: [P1Context],
})
export default class Widget extends Props {
  get __restAttributes(): any {
    return {};
  }

  constructor(
    @SkipSelf() private context: P1Context,
    @Host() private provider: P1Context
  ) {
    super();
    this.provider.value = 10;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
