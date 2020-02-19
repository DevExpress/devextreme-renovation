import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, defaultOptionsRules as buttonRules } from './DxButton';

// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules: { device: () => boolean, options: any }[]) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules = buttonRules.concat([{
  device: function() {
    return true;
  },
  options: {
    hint: "Toggle button"
  }
}]);

@Component({
  selector: 'dx-toggle-button',
  template: `<dx-button
    [height]="height"
    [hint]="hint"
    [stylingMode]="stylingMode"
    [text]="text"
    [type]="type"
    [width]="width"
    [pressed]="pressed"
    (click)="onClickHandler($event)"
    ></dx-button>`
})

export class DxToggleButtonComponent {
  constructor() {
    const defaultOptions = convertRulesToOptions(defaultOptionsRules);
    for(let option in defaultOptions) {
      this[option] = defaultOptions[option];
    }
  }

  @Input() height?: string;
  @Input() hint?: string;
  @Input() stylingMode?: string;
  @Input() text?: string;
  @Input() type?: string;
  @Input() width?: string;

  @Input() pressed: boolean;
  @Output() pressedChange = new EventEmitter();

  onClickHandler(e) {
    this.pressed = !this.pressed;
    this.pressedChange.emit(this.pressed);
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
