import { Input } from "@angular/core";
export class ListInput {
  @Input() items?: Array<{ key: number; text: string }>;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-list",
  template: `<div>
    <ng-container *ngFor="let item of items; trackBy: _trackBy_items_0">
      <div>{{ item.text }}</div>
    </ng-container>
  </div>`,
})
export default class List extends ListInput {
  get __restAttributes(): any {
    return {};
  }
  _trackBy_items_0(_index: number, item: any) {
    return item.key;
  }
}
@NgModule({
  declarations: [List],
  imports: [CommonModule],
  exports: [List],
})
export class DxListModule {}
