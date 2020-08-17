import { Injectable, SkipSelf, Optional, Host } from "@angular/core";
@Injectable()
class P1Context {
  public value: number = 5;
}

import { Input } from "@angular/core";
class Props {
  @Input() p1: number = 10;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span></span>`,
  providers: [P1Context],
})
export default class Widget extends Props {
  get __sum(): any {
    return this.provider.value + this.context.value;
  }
  get __restAttributes(): any {
    return {};
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    @SkipSelf() @Optional() private context: P1Context,
    @Host() private provider: P1Context
  ) {
    super();
    if (!context) {
      this.context = new P1Context();
    }
    this.provider.value = 10;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
