import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from "./DxButton";
import { DxToggleButtonModule } from "./DxToggleButton";

@Component({
  selector: 'dx-button-group',
  template: `
        <div class="dx-button-group">
            <dx-toggle-button
                class="item"
                *ngFor="let item of itemsVM; let i = index; trackBy: trackBy"
                [stylingMode]="stylingMode"
                [pressed]="item.pressed"
                (pressedChange)="pressedChange(i, $event)"
                [text]="item.text"
                [type]="item.type"
                [hint]="item.hint || hint"
                >
            </dx-toggle-button>
        </div>
    `,
  styleUrls: ["./dx-group-button.css"]
})

export class DxButtonGroupComponent {
  @Input() height?: string;
  @Input() hint?: string;
  @Input() items?: Array<any> = [];
  @Input() keyExpr?: string = "";
  @Input() selectionMode?: string;
  @Input() stylingMode?: string;
  @Input() width?: string;

  @Input() selectedItems: Array<string> = [];
  @Output() selectedItemsChange = new EventEmitter();

  pressedChange(index: number, pressed: boolean) {
    const currentButton = this.items[index][this.keyExpr];
    let newValue: string[] = [];

    if(this.selectionMode === "single") {
      newValue = pressed ? [currentButton] : [];
    } else {
      if(pressed) {
        if(this.selectedItems!.indexOf(currentButton) === -1) {
          newValue = this.selectedItems!.concat(currentButton);
        }
      } else {
        newValue = this.selectedItems!.filter((item: string) => item !== currentButton);
      }
    }
    this.selectedItems = newValue;
    this.selectedItemsChange.emit(this.selectedItems);
  }

  trackBy(item) {
    return item[this.keyExpr];
  }

  get itemsVM() {
    return this.items!.map((item: any, i: number, array: any[]) => ({
      ...item,
      pressed: (this.selectedItems || []).indexOf(item[this.keyExpr!]) !== -1,
      classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
    }));
  }
}

@NgModule({
  declarations: [DxButtonGroupComponent],
  imports: [
    CommonModule,
    DxButtonModule,
    DxToggleButtonModule
  ],
  exports: [DxButtonGroupComponent]
})
export class DxButtonGroupModule { }
