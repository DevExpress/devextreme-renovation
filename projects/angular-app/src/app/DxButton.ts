import { Component, EventEmitter, HostListener, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules: { device: () => boolean, options: any }[]) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules: { device: () => boolean, options: any }[] = [{
  device: function() {
    return true;
  },
  options: {
    text: "Push me!"
  }
}];

@Component({
  selector: 'dx-button',
  template: `<div
    [class]="cssClasses"
    [title]="hint"
    [ngStyle]="style"
    (mouseover)="onPointerOver($event)"
    (mouseout)="onPointerOut($event)"
    (mousedown)="onPointerDown($event)"
    (click)="onClickHandler($event)">
    <div class="dx-button-content">
      <span class="dx-button-text">{{text}}</span>
    </div>
  </div>`,
  styleUrls: ['./dx-button.css']
})
export class DxButtonComponent {
  constructor() {
    const defaultOptions = convertRulesToOptions(defaultOptionsRules);
    for(let option in defaultOptions) {
      this[option] = defaultOptions[option];
    }
  }

  @Input() classNames?: Array<string>
  @Input() height?: string;
  @Input() hint?: string;
  @Input() pressed?: boolean;
  @Input() stylingMode?: string;
  @Input() text?: string;
  @Input() type?: string;
  @Input() width?: string;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  _hovered: boolean = false;
  _active: boolean = false;

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

  get style() {
    return {
      width: this.width
    };
  }

  get cssClasses() {
    const classNames = ['dx-button'];

    if(this.stylingMode === 'outlined') {
      classNames.push('dx-button-mode-outlined');
    } else if(this.stylingMode === 'text') {
      classNames.push('dx-button-mode-text');
    } else {
      classNames.push('dx-button-mode-contained');
    }

    if(this.type === 'danger') {
      classNames.push('dx-button-danger');
    } else if(this.type === 'default') {
      classNames.push('dx-button-default');
    } else if(this.type === 'success') {
      classNames.push('dx-button-success');
    } else {
      classNames.push('dx-button-normal');
    }

    if(this.text) {
      classNames.push('dx-button-has-text');
    }

    if(this._hovered) {
      classNames.push("dx-state-hover");
    }

    if(this.pressed || this._active) {
      classNames.push("dx-state-active");
    }
    return classNames.concat(this.classNames || []).join(" ");
  }
}

@NgModule({
  declarations: [DxButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [DxButtonComponent]
})
export class DxButtonModule { }
