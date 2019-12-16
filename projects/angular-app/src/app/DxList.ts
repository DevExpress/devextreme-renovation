import { Component, EventEmitter, Input, NgModule, Output, TemplateRef,ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-list',
  template: `
    <div
      #host
      class="dx-list"
      [ngStyle]="_viewModel.style"
      [title]="_viewModel.hint">
      <div class="dx-list-content">
        <div
          *ngFor="let item of _viewModel.items; let i = index; trackBy: trackBy"
          [class]="['dx-list-item'].concat(item.selected ? 'dx-state-selected' : '', item.hovered ? 'dx-state-hover' : '').join(' ')"
          (click)="selectHandler(item.key)"
          (pointermove)="onItemMove(item.key)"
        >
          <ng-container *ngTemplateOutlet="itemRender ? itemRender : defautlItemRender; context:{item:item}"></ng-container>
        </div>
      </div>
    </div>
    <ng-template #defautlItemRender let-item="item">
      {{item.text}}
    </ng-template>`,
  styleUrls: ['./dx-list.css']
})
export class DxListComponent {
  @ViewChild("host", { static: false }) host: ElementRef<HTMLDivElement>;

  @Input() height?: string;
  @Input() hint?: string;
  @Input() items?: Array<any> = [];
  @Input() keyExpr?: string = "value";
  @Input() displayExpr?: string = "value";
  @Input() width?: string;

  @Input() itemRender: TemplateRef<any>;

  _selectedItems: Array<any> = [];
  @Output() selectedItemsChange = new EventEmitter();
  @Input() get selectedItems() {
    return this._selectedItems;
  }
  set selectedItems(value) {
    this._selectedItems = value;
    this.selectedItemsChange.emit(value);
  }

  hoveredItemKey: string = "";

  onItemMove(key: string) {
    this.hoveredItemKey = key;
  }

  selectHandler(key: any) {
    const index = this.selectedItems!.findIndex(item => item[this.keyExpr!] === key);
    let newValue: any[] = [];
    if(index >= 0) {
      newValue = this.selectedItems!.filter(item => item[this.keyExpr!] !== key);
    } else {
      newValue = this.selectedItems!.concat(this.items!.find(item => item[this.keyExpr!] === key));
    }

    this.selectedItems = newValue;
  }

  export() {
    const htmlContent = this.host.nativeElement.outerHTML;
    const bl = new Blob([htmlContent], {type: "text/html"});
    const a = document.createElement("a");
    a.download = "list.html";
    a.href = URL.createObjectURL(bl);
    a.target = "_blank";
    a.click();
  }

  trackBy(item) {
    return item.key;
  }

  viewModel(model) {
    const viewModel = Object.assign({
      style: {
        width: model.width,
        height: model.height
      }
    },
    model);

    viewModel.items = viewModel.items!.map((item: any) => {
      const selected = (model.selectedItems || []).findIndex((selectedItem: any) => selectedItem[model.keyExpr!] === item[model.keyExpr!]) !== -1;
      return Object.assign({
        text: item[model.displayExpr!],
        key: item[model.keyExpr!],
        selected,
        hovered: !selected && viewModel.hoveredItemKey === item[model.keyExpr!]
      }, item);
    });

    return viewModel;
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel({
      height: this.height,
      hint: this.hint,
      width: this.width,
      items: this.items,
      keyExpr: this.keyExpr,
      displayExpr: this.displayExpr,
      selectedItems: this.selectedItems,
      hoveredItemKey: this.hoveredItemKey
    });
  }
}

@NgModule({
  declarations: [DxListComponent],
  imports: [
    CommonModule
  ],
  exports: [DxListComponent]
})
export class DxListModule { }
