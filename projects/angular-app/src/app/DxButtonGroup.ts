import { Component, Input, Output, EventEmitter, ContentChild, ElementRef } from '@angular/core';
import { DxButtonComponent } from "./DxButton";

@Component({
  selector: 'dx-button-group',
  template: `
        <div class="dx-button-group">
            <dx-button
                class="item"
                *ngFor="let item of _viewModel.items; let i = index; trackBy: trackBy"
                (click)="onClickHandler(i)"
                [stylingMode]="_viewModel.stylingMode"
                [pressed]="item.pressed"
                [text]="item.text"
                [classNames]="item.classNames"
                [type]="item.type"
                [hint]="item.hint || _viewModel.hint"
                >
            </dx-button>
        </div>
    `,
  entryComponents: [DxButtonComponent],
  styleUrls: ["./dx-group-button.css"]
})
export class DxButtonGroupComponent {
  @Input() height: String;
  @Input() hint: String;
  @Input() items: Array<any> = [];
  @Input() keyExpr: string;
  @Input() selectionMode: String;
  @Input() stylingMode: String;
  @Input() width: String;

  _selectedItems: Array<String> = [];
  @Output() selectedItemsChange = new EventEmitter();
  @Input() get selectedItems() {
    return this._selectedItems;
  }
  set selectedItems(value) {
    this._selectedItems = value;
    this.selectedItemsChange.emit(value);
  }

  onClickHandler(index: number) {
    const currentButton = this.items[index][this.keyExpr];
    if (this.selectionMode === "single") {
      if (this.selectedItems[0] === currentButton) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [currentButton];
      }
    } else {
      if (this.selectedItems.indexOf(currentButton) !== -1) {
        this.selectedItems = this.selectedItems.filter(item => item !== currentButton);
      } else {
        this.selectedItems = this.selectedItems.concat(currentButton);
      }
    }
  }

  trackBy(item) {
    return item[this.keyExpr];
  }

  viewModel(model) {
    const viewModel = Object.assign({}, model);
    viewModel.items = viewModel.items.map((item, i, array) => (Object.assign({}, item,
      {
        pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1,
        classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
      }
    )));

    return viewModel;
  }

  getModel() {
    return {
      height: this.height,
      hint: this.hint,
      width: this.width,
      items: this.items,
      keyExpr: this.keyExpr,
      selectedItems: this.selectedItems,
      selectionMode: this.selectionMode,
      stylingMode: this.stylingMode
    };
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel(this.getModel());
  }
}
