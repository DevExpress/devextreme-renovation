import { Component, ComponentBindings, Event, InternalState, Listen, JSXComponent, OneWay, React, Method, Ref } from '../generator/component_declaration/common';
import './button.css';

export const defaultOptionsRules: { device: () => boolean, options: any }[] = [{
  device: function() {
    return true;
  },
  options: {
    text: "Push me!",
    sdfsdf: ""
  }
}];

@ComponentBindings()
export class ButtonInput {
  @OneWay() classNames?: string[]
  @OneWay() elementAttr?: { [name: string]: any } = {};
  @OneWay() height?: string;
  @OneWay() hint?: string;
  @OneWay() pressed?: boolean;
  @OneWay() stylingMode?: string;
  @OneWay() text?: string;
  @OneWay() type?: string;
  @OneWay() width?: string;
  @Event() onClick?: (e: any) => void = (() => {});
}

@Component({
  name: 'Button',
  components: [],
  viewModel() {},
  view: viewFunction,
  defaultOptionsRules() {
    return defaultOptionsRules;
  }
})

export default class Button extends JSXComponent<ButtonInput> {
  @Ref() host!: HTMLDivElement;

  @InternalState() _hovered: boolean = false;
  @InternalState() _active: boolean = false;

  @Listen("pointerover")
  onPointerOver() {
    this._hovered = true;
  }

  @Listen("pointerout")
  onPointerOut() {
    this._hovered = false;
  }

  @Listen("pointerdown")
  onPointerDown() {
    this._active = true;
  }

  @Listen('pointerup', { target: document })
  onPointerUp() {
    this._active = false;
  }

  @Listen("click")
  onClickHandler(e: any) {
    this.props.onClick!({ type: this.props.type, text: this.props.text });
  }

  @Method()
  focus() {
    this.host.focus();
  }

  get style() {
    return {
      width: this.props.width
    };
  }

  get cssClasses() {
    const classNames = ['dx-button'];

    if(this.props.stylingMode === 'outlined') {
      classNames.push('dx-button-mode-outlined');
    } else if(this.props.stylingMode === 'text') {
      classNames.push('dx-button-mode-text');
    } else {
      classNames.push('dx-button-mode-contained');
    }

    if(this.props.type === 'danger') {
      classNames.push('dx-button-danger');
    } else if(this.props.type === 'default') {
      classNames.push('dx-button-default');
    } else if(this.props.type === 'success') {
      classNames.push('dx-button-success');
    } else {
      classNames.push('dx-button-normal');
    }

    if(this.props.text) {
      classNames.push('dx-button-has-text');
    }

    if(this._hovered) {
      classNames.push("dx-state-hover");
    }

    if(this.props.pressed || this._active) {
      classNames.push("dx-state-active");
    }
    return classNames.concat(this.props.classNames || []).join(" ");
  }
}

function viewFunction(viewModel: Button) {
  return (
    <div
      ref={viewModel.host}
      className={viewModel.cssClasses}
      title={viewModel.props.hint}
      style={viewModel.style}
      {...viewModel.props.elementAttr}
      onPointerOver={viewModel.onPointerOver}
      onPointerOut={viewModel.onPointerOut}
      onPointerDown={viewModel.onPointerDown}
      onClick={viewModel.onClickHandler}>
      <div className="dx-button-content">
        <span className="dx-button-text">{viewModel.props.text}</span>
      </div>
    </div>
  );
}

