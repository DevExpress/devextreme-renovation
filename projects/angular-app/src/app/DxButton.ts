import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

function getCssClasses(model) {
  const classNames = ['dx-button'];

  if(model.stylingMode === 'outlined') {
    classNames.push('dx-button-mode-outlined');
  } else if(model.stylingMode === 'text') {
    classNames.push('dx-button-mode-text');
  } else {
    classNames.push('dx-button-mode-contained');
  }

  if(model.type === 'danger') {
    classNames.push('dx-button-danger');
  } else if(model.type === 'default') {
    classNames.push('dx-button-default');
  } else if(model.type === 'success') {
    classNames.push('dx-button-success');
  } else {
    classNames.push('dx-button-normal');
  }

  if(model.text) {
    classNames.push('dx-button-has-text');
  }

  if(model._hovered) {
    classNames.push("dx-state-hover");
  }

  if(model.pressed || model._active) {
    classNames.push("dx-state-active");
  }
  return classNames.concat(model.classNames).join(' ');
}

@Component({
  selector: 'dx-button',
  template: `<div
    [class]="_viewModel.cssClasses"
    [title]="_viewModel.hint"
    [ngStyle]="_viewModel.style"
    (mouseover)="onPointerOver($event)"
    (mouseout)="onPointerOut($event)"
    (mousedown)="onPointerDown($event)"
    (click)="onClickHandler($event)">
    <div class="dx-button-content">
      <span class="dx-button-text">{{_viewModel.text}}</span>
    </div>
  </div>`,
  styleUrls: ['./dx-button.css']
})
export class DxButtonComponent {
  @Input() classNames: Array<string>
  @Input() height: String;
  @Input() hint: String;
  @Input() pressed: Boolean;
  @Input() stylingMode: String;
  @Input() text: String;
  @Input() type: String;
  @Input() width: String;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  _hovered: Boolean = false;
  _active: Boolean = false;

  onPointerOver() {
    this._hovered = true;
  }

  onPointerOut() {
    this._hovered = false;
  }

  onPointerDown() {
    this._active = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onPointerUp() {
    this._active = false;
  }

  onClickHandler(e) {
    this.onClick.emit({ type: this.type, text: this.text });
  }

  viewModel(model) {
    return Object.assign({
      cssClasses: getCssClasses(model),
      style: {
        width: model.width
      }
    }, model);
  }

  getModel() {
    return {
      classNames: this.classNames,
      height: this.height,
      hint: this.hint,
      pressed: this.pressed,
      stylingMode: this.stylingMode,
      text: this.text,
      type: this.type,
      width: this.width,
      _hovered: this._hovered,
      _active: this._hovered
    };
  }

  _viewModel: any;
  ngDoCheck() {
    this._viewModel = this.viewModel(this.getModel());
  }
}
