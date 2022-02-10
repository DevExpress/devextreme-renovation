import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class ListInput {
  @Input() items?: any[] = [];
  @Input() keyExpr?: string = "value";
}
import {
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

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
  defaultEntries: DefaultEntries;
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

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new ListInput() as { [key: string]: any };
    this.defaultEntries = ["items", "keyExpr"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [List],
  imports: [CommonModule],

  exports: [List],
})
export class DxListModule {}
export { List as DxListComponent };
