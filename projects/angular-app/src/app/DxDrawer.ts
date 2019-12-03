import { Component, EventEmitter, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-drawer',
  template: `<div
    class="dx-drawer"
    [title]="_viewModel.hint"
    [ngStyle]="_viewModel.style">
    <div [class]="_viewModel.drawerCSS">
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
  // drawer?: React.ReactNode,
  // children?: React.ReactNode


  @Input() height?: string;
  @Input() hint?: string;
  @Input() width?: string;

  _opened: boolean;
  @Output() openedChange = new EventEmitter();
  @Input() get opened() {
    return this._opened;
  }

  set opened(value) {
    this._opened = value;
    this.openedChange.emit(value);
  }

  onClickHandler(e) {
    this.opened = false;
  }

  viewModel(model) {
    return Object.assign({
      drawerCSS: ["dx-drawer-panel"] .concat(model.opened ? "dx-state-visible" : "dx-state-hidden") .join(" "),
      style: {
        width: model.width,
        height: model.height
      }
    }, model);
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel({
      height: this.height,
      hint: this.hint,
      opened: this.opened,
      width: this.width
    });
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
