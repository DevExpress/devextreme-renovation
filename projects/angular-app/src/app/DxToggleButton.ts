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
  @Input() height: String;
  @Input() hint: String;
  @Input() stylingMode: String;
  @Input() text: String;
  @Input() type: String;
  @Input() width: String;

  _pressed: Boolean;
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

  getModel() {
    return {
      height: this.height,
      hint: this.hint,
      pressed: this.pressed,
      stylingMode: this.stylingMode,
      text: this.text,
      type: this.type,
      width: this.width
    };
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel(this.getModel());
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
