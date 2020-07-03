import { Input } from "@angular/core";

export class Props {
  @Input() p: number = 10;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<div></div>`,
})
export default class Widget extends Props {
  i: number = 10;
  get __g1(): number[] {
    if (this.__getterCache["g1"] !== undefined) {
      return this.__getterCache["g1"];
    }
    return (this.__getterCache["g1"] = ((): number[] => {
      return [this.p, this.i];
    })());
  }
  get __g2(): number {
    return this.p;
  }
  get __restAttributes(): any {
    return {};
  }

  __getterCache: {
    g1?: number[];
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["p"].some((d) => changes[d])) {
      this.__getterCache["g1"] = undefined;
    }
  }

  set _i(i: number) {
    this.i = i;
    this.__getterCache["g1"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
