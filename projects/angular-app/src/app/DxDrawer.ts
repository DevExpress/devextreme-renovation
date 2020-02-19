import { Component, EventEmitter, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-drawer',
  template: `<div
    class="dx-drawer"
    [title]="hint"
    [ngStyle]="style">
    <div [class]="drawerCSS">
      <ng-content select="[drawer]"></ng-content>
    </div>
    <div
      class="dx-drawer-content"
      (click)="onClickHandler($event)">
        <ng-content></ng-content>
    </div>
  </div>`,
  styleUrls: ['./dx-drawer.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class DxDrawerComponent {
  @Input() height?: string;
  @Input() hint?: string;
  @Input() width?: string;

  @Input() opened: boolean;
  @Output() openedChange = new EventEmitter();

  onClickHandler(e) {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  get drawerCSS() {
    return ["dx-drawer-panel"].concat(this.opened ? "dx-state-visible" : "dx-state-hidden").join(" ");
  }

  get style() {
    return {
      width: this.width,
      height: this.height
    };
  }
}

@NgModule({
  declarations: [DxDrawerComponent],
  imports: [
    CommonModule
  ],
  exports: [DxDrawerComponent]
})
export class DxDrawerModule { }
