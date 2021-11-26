import { Input } from "@angular/core";
export class ListInput {
  __itemsInternalValue?: any[] = [];
  @Input()
  set items(value: any[] | undefined) {
    if (value !== undefined) this.__itemsInternalValue = value;
    else this.__itemsInternalValue = [];
  }
  get items() {
    return this.__itemsInternalValue;
  }

  __keyExprInternalValue?: string = "value";
  @Input()
  set keyExpr(value: string | undefined) {
    if (value !== undefined) this.__keyExprInternalValue = value;
    else this.__keyExprInternalValue = "value";
  }
  get keyExpr() {
    return this.__keyExprInternalValue;
  }
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
  selector: "dx-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["items", "keyExpr"],
  template: `<ng-template #widgetTemplate
    ><div
      ><div
        ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
          ><div>One -{{ item.key }}</div></ng-container
        ></div
      ><div
        ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_1"
          ><div>Two -{{ item.key }}</div></ng-container
        ></div
      ></div
    ></ng-template
  >`,
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
  declarations: [List],
  imports: [CommonModule],

  exports: [List],
})
export class DxListModule {}
export { List as DxListComponent };
