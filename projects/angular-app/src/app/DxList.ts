import { Component, EventEmitter, Input, NgModule, Output, TemplateRef,ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-list',
  template: `
    <div
      #host
      class="dx-list"
      [ngStyle]="style"
      [title]="hint">
      <div class="dx-list-content">
        <div
          *ngFor="let item of itemsVM; let i = index; trackBy: trackBy"
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

  get style() {
    return {
      width: this.width,
      height: this.height
    };
  }

  get itemsVM() {
    return this.items!.map((item: any) => {
      const selected = (this.selectedItems || []).findIndex((selectedItem: any) => selectedItem[this.keyExpr!] === item[this.keyExpr!]) !== -1;
      return {
        ...item,
        text: item[this.displayExpr!],
        key: item[this.keyExpr!],
        selected,
        hovered: !selected && this.hoveredItemKey === item[this.keyExpr!]
      };
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
