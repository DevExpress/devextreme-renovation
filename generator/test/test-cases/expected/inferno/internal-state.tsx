function view(model: Widget) {
  return <span></span>;
}

import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof {}>;
export default class Widget extends InfernoComponent<{} & RestProps> {
  state = {
    _hovered: false,
  };
  constructor(props: {} & RestProps) {
    super({
      ...props,
    });
  }

  get _hovered(): Boolean {
    return this.state._hovered;
  }
  set _hovered(value: Boolean) {
    this.setState({
      _hovered: value,
    });
  }

  updateState(): any {
    this._hovered = !this._hovered;
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      ...props,
      _hovered: this._hovered,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
