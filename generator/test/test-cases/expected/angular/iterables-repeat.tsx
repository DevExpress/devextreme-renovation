import { Input } from "@angular/core";
export class ListInput {
  @Input() items?: any[] = [];
  @Input() keyExpr?: string = "value";
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
  selector: "dx-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <div>
      <ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
        ><div>One -{{ item.key }}</div></ng-container
      >
    </div>
    <div>
      <ng-container *ngFor="let item of items; trackBy: _trackBy_items_1"
        ><div>Two -{{ item.key }}</div></ng-container
      >
    </div>
  </div>`,
})
export default class List extends ListInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  _trackBy_items_0(_index: number, item: any) {
    return item.key;
  }
  _trackBy_items_1(_index: number, item: any) {
    return item.key;
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [List],
  imports: [CommonModule],
  exports: [List],
})
export class DxListModule {}
