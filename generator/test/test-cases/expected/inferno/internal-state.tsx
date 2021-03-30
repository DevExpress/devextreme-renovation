import {
  BaseInfernoComponent,
  InfernoComponent,
} from "../../../../modules/inferno/base_component";
function view(model: Widget) {
  return <span></span>;
}

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<{} & RestProps> {
  state: {
    _hovered: Boolean;
  };
  _currentState: {
    _hovered: Boolean;
  } | null = null;

  refs: any;

  constructor(props: {} & RestProps) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  get _hovered(): Boolean {
    const state = this._currentState || this.state;
    return state._hovered;
  }
  set__hovered(value: () => Boolean): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { _hovered: newValue };
    });
  }

  updateState(): any {
    this.set__hovered(() => !this._hovered);
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
