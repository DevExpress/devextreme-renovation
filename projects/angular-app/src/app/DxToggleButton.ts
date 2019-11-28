import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from './DxButton';

@Component({
  selector: 'dx-toggle-button',
  template: `<dx-button
    [height]="_viewModel.height"
    [hint]="_viewModel.hint"
    [stylingMode]="_viewModel.stylingMode"
    [text]="_viewModel.text"
    [type]="_viewModel.type"
    [width]="_viewModel.width"
    [(pressed)]="_viewModel.pressed"
    (click)="onClickHandler($event)"
    ></dx-button>`
})

export class DxToggleButtonComponent {
  @Input() height?: string;
  @Input() hint?: string;
  @Input() stylingMode?: string;
  @Input() text?: string;
  @Input() type?: string;
  @Input() width?: string;

  _pressed: boolean;
  @Output() pressedChange = new EventEmitter();
  @Input() get pressed() {
    return this._pressed;
  }

  set pressed(value) {
    this._pressed = value;
    this.pressedChange.emit(value);
  }

  onClickHandler(e) {
    this.pressed = !this.pressed;
  }

  viewModel(model) {
    return Object.assign({}, model);
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel({
      height: this.height,
      hint: this.hint,
      pressed: this.pressed,
      stylingMode: this.stylingMode,
      text: this.text,
      type: this.type,
      width: this.width
    });
  }
}

@NgModule({
  declarations: [DxToggleButtonComponent],
  imports: [
    CommonModule,
    DxButtonModule
  ],
  exports: [DxToggleButtonComponent]
})
export class DxToggleButtonModule { }
